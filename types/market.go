package types

import (
	"fmt"
	"math/big"
	"strconv"
)

// convertable
func Covertable(points, coins *big.Int) (*big.Int, *big.Int, error) {
	if points != nil && coins != nil {
		return nil, nil, fmt.Errorf("only one should have value")
	}
	return nil, nil, nil
}

type ConvRes struct {
	Coins  string
	Points string
	ConvRaw
}

type ConvRaw struct {
	RawCoins  *big.Int
	RawPoints *big.Int
}

// if max its negative value
func (c ConvRaw) CoinsInt() int64 {
	return strToInt(c.RawCoins.String())
}

// if max its negative value
func (c ConvRaw) PointsInt() int64 {
	return strToInt(c.RawPoints.String())
}

func strToInt(str string) int64 {
	n, err := strconv.ParseInt(str, 10, 64)
	if err != nil {
		return -1
	}
	return n
}
