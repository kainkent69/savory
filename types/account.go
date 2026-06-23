package types

import (
	"fmt"
	"log/slog"
	"math/rand/v2"

	"github.com/alexedwards/argon2id"
	"github.com/jmoiron/sqlx"
)

var db *sqlx.DB

type Login struct {
	Email    string
	Password string
}

type Account struct {
	Id int64
	Login
	// 0: personal referall key and 1: invitee key
	Ref0 string
	Ref1 string

	// this is not  yet used
	// this values should be done by *big.Int but for db freindly use from to and all
	Points uint64 // points
	Cons   uint64 // coins
	Savory uint64 // savory
	Merit  uint64 // merit
	Earned uint64 // earned

	// sync
	Synced int64 // the
	Updatable
}

func getFrom(size int, bytes []byte) []byte {

	var chars = []byte{}
	for range size {
		rand := rand.IntN(len(bytes))
		chars = append(chars, bytes[rand])
	}
	return chars
}

func genRef() string {
	var chars = []byte{}
	charset1 := "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz"
	charset2 := "1234567890"
	chars = append(chars, getFrom(8, []byte(charset1))...)
	chars = append(chars, '-')
	chars = append(chars, getFrom(4, []byte(charset2))...)
	// return
	return string(chars)

}

// create new account
func NewAccount(l Login, invited string) Account {
	return Account{
		Login: l,
		Ref0:  genRef(),
		Ref1:  invited,
	}
}

// save a new account
func (a *Account) New(db sqlx.Ext) error {
	passwd, err := argon2id.CreateHash(a.Password, argon2id.DefaultParams)
	if err != nil {
		slog.Error("failed: password hasing", "err", err)
		return err
	}
	return db.QueryRowx("INSERT INTO accounts (email, passwd, ref0, ref1 ) VALUES($1,$2,$3,IFNULL($4, '') ) RETURNING id, up_at, crt_at", a.Email, passwd, a.Ref0, a.Ref1).Scan(&a.Id, &a.UpAt, &a.CrtAt)
}

// TODO: validate
func (a *Account) Validate() error {
	return nil
}

// TODO: authenticaate or login
func (a *Account) Authenticate(db sqlx.Ext) error {
	// email
	var passwd string
	err := db.QueryRowx("SELECT passwd FROM accounts WHERE email = $1").Scan(&passwd)
	if err != nil {
		slog.Error("failed to validate", "err", err)
		return err
	}
	match, err := argon2id.ComparePasswordAndHash(a.Password, passwd)
	if err != nil {
		slog.Error("failed to check password", "err", err)
		return err
	}
	if !match {
		slog.Error("not matched")
		return fmt.Errorf("failed password not matched")
	}
	return nil
}

type Signup struct {
	Login
	RepeatPassword string
}

func (l Login) FindAccount() (*Account, error) {
	return nil, nil
}

func (l Login) Login() error {
	return nil
}

// create and save new account
func (a Signup) New() error {
	return nil
}
