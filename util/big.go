package util

import "math/big"

func FromStr(str string) *big.Int {
	if str == "" {
		return big.NewInt(0)
	}
	val, _ := new(big.Int).SetString(str, 10)
	return val
}

func AddBig(a *big.Int, b ...*big.Int) *big.Int {
	val := big.NewInt(0)
	for _, v := range b {
		val.Add(val, v)
	}
	return val
}

func SubBig(a *big.Int, b ...*big.Int) *big.Int {
	val := new(big.Int).Set(a)
	for _, v := range b {
		val.Sub(val, v)
	}
	return val
}

func MulBig(a *big.Int, b ...*big.Int) *big.Int {
	val := big.NewInt(1)
	for _, v := range b {
		val.Mul(val, v)
	}
	return val
}

func DivBig(a *big.Int, b ...*big.Int) *big.Int {
	val := new(big.Int).Set(a)
	for _, v := range b {
		val.Div(val, v)
	}
	return val
}
