package types

import (
	"math/big"

	"github.com/jmoiron/sqlx"
	"github.com/redis/go-redis/v9"
)

// exchange
type Exchange struct {
	Liquid *big.Int
	Points *big.Int
	Base   *big.Int // inital price per tokens
	// merit
	Merits *big.Int
	// minimum amount needed
	MConverstion int64 // int64 it  is not
	// this is pre-gevin for the calculation
	Preloaded int64 // this is whats given
	conn      *redis.Conn
	db        *sqlx.DB
}

// look for preloaded and use them to do the data this is used to allow points
// points is distributed

type Rewarder interface {
	// reward:  reward amount
	Reward(id int64, amount int64) // all of them is given
	// the conversion rate of a point
	Value(points *big.Int) int64 // the value of the points
}

// a rewarding of points or the reward catcher
type Reward struct {
	To     int64 // the id
	Amount int64 // the reward
	Backed int64 // the reward
}

const REWARDER_INDEXES = "reward_index_key"
