package social

import "time"

type Votes struct {
	Vote  int64 // upvote : 1, downvote: 2
	Rates int64 // upto 5 merits
	// only personal posts
}

type Timestamp struct {
	CrtAt time.Time
	UpAt  time.Time
}

// with Attachement
type Attachement struct {
	Version   int64
	Format    string
	Locations string
	Type      string
}

// feed item
type FeedItem struct {
	Votes
	Direct    bool // always true on posts, depends on posts
	EditCount int64
	Kind      string // "post", "pool", ""
	Timestamp
	Visibility int64 // public, private, network, circle
	Data       any
}

// feeds
// the posts type
type Posts struct {
	Id        int64
	Usr       int64 // the user table id
	Merits    int64
	Emotes    int64
	PostTexts int64
	Attached  []int64 // the ids stored  you put
	// the tages used limit 10
	Tags []string
	// edit counts
	EditCount int64
	Format    int64 // can be any text or some format to change the display of the posts
	Sponsored bool  // sponsored
	Type      int64 // 0 posts, 1: comments,
}

// poo something
type Pool struct {
	Opt    string // separated by *** because its hard to replicate or oher pattern with the check of contents recorded to db
	Merits int64  // filter 2 - 5 mertis

	// not in db just data
	Options   []int64
	VoteCount int64
	Votes     map[int]string
}

// pool options
type PoolOptions struct {
	Id   int64  // 0 = "A" 26 = "B"
	What string // the actual broken down of optins
}

// pool votes
type Poolvote struct {
	Id   int64
	Usr  int64 // the user table id
	Feed int64
}

// local
type Riddle struct {
	Id                     int64
	Usr                    int64 // the user table id
	Question               string
	Personal               string
	DurationBDaysStr       string
	RequiredParticipations int64
}
