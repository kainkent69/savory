package types_test

import (
	"math/big"
	"testing"

	"github.com/kainkent69/savory/util"
	"github.com/stretchr/testify/assert"
)

func TestBig(t *testing.T) {
	t.Run("add", func(t *testing.T) {
		result := util.AddBig(nil, big.NewInt(1), big.NewInt(2), big.NewInt(3))
		assert.Equal(t, big.NewInt(6), result)
	})

	t.Run("add empty", func(t *testing.T) {
		result := util.AddBig(nil) // <- fixed
		assert.Equal(t, big.NewInt(0), result)
	})

	t.Run("sub", func(t *testing.T) {
		result := util.SubBig(big.NewInt(10), big.NewInt(3), big.NewInt(2)) // <- fixed
		assert.Equal(t, big.NewInt(5), result)
	})

	t.Run("sub single", func(t *testing.T) {
		result := util.SubBig(big.NewInt(42)) // <- fixed
		assert.Equal(t, big.NewInt(42), result)
	})

	t.Run("mul", func(t *testing.T) {
		result := util.MulBig(nil, big.NewInt(2), big.NewInt(3), big.NewInt(4)) // <- fixed
		assert.Equal(t, big.NewInt(24), result)
	})

	t.Run("mul empty", func(t *testing.T) {
		result := util.MulBig(nil) // <- fixed
		assert.Equal(t, big.NewInt(1), result)
	})

	t.Run("div", func(t *testing.T) {
		result := util.DivBig(big.NewInt(100), big.NewInt(5), big.NewInt(2)) // <- fixed
		assert.Equal(t, big.NewInt(10), result)
	})

	t.Run("div single", func(t *testing.T) {
		result := util.DivBig(big.NewInt(99)) // <- fixed
		assert.Equal(t, big.NewInt(99), result)
	})
}
