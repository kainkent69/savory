package types

import (
	"time"
)

type Updatable struct {
	// crrt_at and up_at
	CrtAt time.Time
	UpAt  time.Time
}

// auth
type Auther interface {
	CheckIn(a Login) ([]string, error) // validate or create tokens for this
	Refresh(token string) error
	Logout(email string)
}
