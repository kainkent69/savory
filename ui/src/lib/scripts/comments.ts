// ── Comments group class (implements TComments from types/feed.d.ts) ──
// TComment is declared globally in types/feed.d.ts — no need to redefine

export class Comments {
	count: number = 0        // TOTAL comments at this level (static, from post metadata)
	loaded: number = 0       // how many fetched so far
	reply: boolean = false   // true if this is a reply group
	level: number = 0        // nesting level (0 = top)
	parent: TComment | null = null  // parent comment (not group)
	comments: TComment[] = []       // flat comments at this level
	loadMore: (() => Promise<void>) | null = null

	get siblings(): number {
		if (!this.parent) return this.count
		return this.parent.group!.count
	}

	add(items: TComment[]): void {
		for (const c of items) {
			c.index = this.loaded
			c.level = this.level
			c.group = this
			this.comments.push(c)
			this.loaded++
		}
		this.count = Math.max(this.count, this.loaded)
	}

	hasNext(index: number): boolean {
		return index + 1 < this.count
	}

	async next(index: number): Promise<string> {
		if (!this.hasNext(index)) throw new Error('no next')
		// trigger load if next sibling not fetched yet
		if (index + 1 >= this.loaded && this.loadMore) {
			await this.loadMore()
		}
		// target: parent's next sibling at parent's level
		if (this.level === 0) return `c-0:${index + 1}`
		const p = this.parent!
		return `c-${p.group!.level}:${p.index + 1}`
	}
}
