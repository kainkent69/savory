
enum FeedType {
	P = "post", // pool
	PL = "pool", // pool
	V = "votes", // this is like some post asking if where are you or something like a pool but not
	R = "riddles",// this is for riddles
	O = "others"
}


enum FeedFormat {
	D = "default",
	O = "others"
}


/// alias for feed type
type FT = FeedType
type FF = FeedFormat

interface Engagement {
	views: number // the number of views
	engagements: number // clicked and or liked or that 
	up: number // upvote
	down: number
	pins: number
	star: number // stars given
	emote: number

}
interface Timestamp {

	crt_at: number // timestamp
	up_at: number // timestamp

}
interface Feed extends Timestamp {
	type: FT
	poster: Poster
	data: T // can be posts or others
	engagement: Engagement
	has_comments: bool // if it has comments
	most_relevant_id: TComment // this is the comments first used does not care about metadata
	sponsored: bool
	has_images: bool
	// format type 
	format: string // "default" TODO: expand later



}
declare interface TComment extends Timestamp {
	id: number
	poster: string
	avatar: string
	comment: string
	img: string
	feed_id: number
	engagements: Engagement
	index: number
	level: number
	replies: TComment[]
	group?: TComments
}


interface TComments {
	count: number // the number that there is
	loaded: number // the number that is loaded
	// if its a reply
	reply: boolean
	comments: TComment[]
	get siblings(): number // this is sthe sibling count
	parent: TComment | null // this is the parent
	// this should be implemented that would create a store, 
	// this updates the metadata and updates to do the indexing because we can load more and more comments as w read
	// updates metadata, levels and all
	add(comments: TComment[])
	hasNext(index: number): boolean
	next(index: number): Promise<string>
	level: number // level
}




interface PostData {
	id: number // self id
	to: number  // the user
	text: string // the text post  can be empty
	image_url: string // link
	// the number of image
	image_count: number
	topics: string[] // topics
}


interface SharedPost {
	id: number
	to: number // id of  the user
	postId: number // the posts id
	poster: Poster
	text: string // the text  discriptin or title
}



interface Poster {
	name: string
	country: string
	profile: string // profile link
	followers: int64 // the followers
	network: int64 // the network
	username: string // the username
	sub: string // the sub string
	karma: int64
	merit: int64
	points: int64
	profile_picure?: string // the link none by default
}



