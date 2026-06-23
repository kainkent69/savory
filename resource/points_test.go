package resource_test

import (
	"fmt"
	"strings"
	"testing"

	"github.com/google/uuid"
	"github.com/kainkent69/savory/resource"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestPoints(t *testing.T) {
	t.Run("conversion", func(t *testing.T) {
		points := resource.Points{
			To:     1,
			Points: 1000 * 100,
			Sub:    uuid.NewString(),
		}

		points_str := points.String()
		assert.Equal(t, fmt.Sprintf("%d|%s|%d", points.To, points.Sub, points.Points), points_str)
		split := strings.Split(points_str, "|")
		assert.Len(t, split, 3)
		points2, err := resource.ToPoints(points_str)
		require.NoError(t, err)
		assert.Equal(t, points, *points2)
	})

	// push it
	t.Run("push", func(t *testing.T) {

	})
}
