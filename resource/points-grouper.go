package resource

import (
	"context"
	"fmt"
	"log/slog"
	"strings"
	"sync"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

type PointsGrouper struct {
	rdb *redis.Client
	db  *sqlx.DB
	m   *sync.Mutex
}

// a function that will  create or read the list to group them and put them as a batch
func (p PointsGrouper) Group() error {
	group_key := fmt.Sprintf("%s:%s", PointsGroup, uuid.NewString())
	pipe := p.rdb.Pipeline()
	p.m.Lock()
	defer p.m.Unlock()
	res, _, err := pipe.SScan(context.Background(), PointsPending, 0, "*", 100).Result()
	if err != nil {
		slog.Error("failed to scan", "err", err)
		return err
	}
	ctx := context.Background()
	datas := strings.Join(res, "\n")
	pipe.Set(ctx, group_key, datas, 0)
	pipe.SAdd(ctx, PointsGroup, group_key)
	pipe.Del(ctx, res...)
	_, err = pipe.Exec(context.Background())
	return err

}

// pick will collect the batch in the processing or grouped
// read it
// if sucessful if its commit then put it to the list
func (p PointsGrouper) Pick() error {
	ctx := context.Background()
	pipe := p.rdb.Pipeline()
	res, _, err := pipe.SScan(ctx, PointsGroup, 0, "*", 5).Result()
	if err != nil {
		slog.Error("failed to scan ", "err", err)
		return err
	}

	for _, each := range res {
		p.rdb.Watch(ctx, func(tx *redis.Tx) error {
			list := strings.Split(each, "\n")
			// process each commit
			tx.SMove(ctx, PointsGroup, PointsFinished, each)
			db_tx, err := p.db.Beginx()
			if err != nil {
				slog.Error("failed to begin db tx", "err", err)
				return err
			}
			preapere, err := db_tx.Prepare("")
			if err != nil {
				slog.Error("failed to preapre", "err", err)
				return err
			}

			for _, item := range list {
				points, err := ToPoints(item)
				if err != nil {
					slog.Error("failed to convert", "err", err)
					return err
				}
				rows, err := preapere.Exec(points.To, points.Points)
				if err != nil {
					slog.Error("failed to exec", "err", err)
					return err
				}
				affeted, err := rows.RowsAffected()
				if err != nil {
					slog.Error("failed to check affected", "err", err)
					return err
				}
				if affeted == 0 {
					slog.Debug("affected is  ", "affected", affeted)
					return fmt.Errorf("has %d affectd", affeted)
				}
			}
			return nil
		}, each)
	}
	return nil
}
