package resource

import (
	"context"
	"fmt"
	"log/slog"
	"strconv"
	"strings"

	"github.com/google/uuid"
	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

var (
	pointSet       = "savory-points"
	PointsPending  = fmt.Sprintf("%s:pending", pointSet)
	PointsGroup    = fmt.Sprintf("%s:group", pointSet)
	PointsFinished = fmt.Sprintf("%s:finished", pointSet)
)

// TODO: empliment a store
// the points that is existing and rewardable
type PointsData struct {
	Distributed int64 // to distribute // d: in redis data
	// the number of points that can be distributed
	Hot   int64 // h
	Count int64 // c
}

// points
type Points struct {
	To     int64 // the id for the points
	Points int64 // this is points input as string // better for input safety
	Sub    string
}

// get the points
func (p Points) String() string {
	return fmt.Sprintf("%d|%s|%d", p.To, p.Sub, p.Points) // to|sub|points
}

func ToPoints(str string) (*Points, error) {
	split := strings.Split(str, "|")
	if len(split) != 3 {
		return nil, fmt.Errorf("%s is not valid", str)
	}
	to, err := strconv.ParseInt(split[0], 10, 64)
	if err != nil {
		return nil, err
	}
	amount, err := strconv.ParseInt(split[2], 10, 64)
	if err != nil {
		return nil, err
	}

	return &Points{To: to, Points: amount, Sub: split[1]}, nil
}

type PointsQueue struct {
	rdb *redis.Client
	db  *sqlx.DB
}

func (p *PointsQueue) Init(rdb *redis.Client, db *sqlx.DB) {
	slog.Info("points queue init")
	p.rdb = rdb
	p.db = db
}

// the amount is somthing we do
func (p PointsQueue) Push(ctx context.Context, to int64, amount int64) error {
	points := Points{
		To:     to,
		Points: amount,
		Sub:    uuid.NewString(),
	}
	pipe := p.rdb.Pipeline()
	pipe.SAdd(ctx, PointsPending, points.String())
	pipe.HIncrBy(ctx, pointSet, "d", amount)
	_, err := pipe.Exec(context.Background())
	return err
}
