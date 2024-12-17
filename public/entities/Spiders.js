export class Spiders {
    constructor(positions, ranges, durations, type) {
        this.ranges = ranges;
        this.durations = durations;
        this.spiders = [];
        for (const position of positions) {
            this.spiders.push(
                add([
                    sprite("camera"), // Use camera sprite
                    pos(position),
                    area({
                        shape: new Rect(vec2(0, 4.5), 90, 370),
                        collisionIgnore: ["spiders"],
                    }),
                    anchor("center"),
                    body(),
                    scale(0.2),
                    offscreen(),
                    "spiders",
                ])
            );
        }
    }

    // Crawl movement method
    async crawl(spider, moveBy, duration) {
        await tween(
            spider.pos.x,
            spider.pos.x + moveBy,
            duration,
            (posX) => (spider.pos.x = posX),
            easings.easeOutSine
        );
    }

    // Set movement pattern without animations
    setMovementPattern() {
        for (const [index, spider] of this.spiders.entries()) {
            const moveLeft = async () => {
                spider.flipX = true
                await this.crawl(spider, -this.ranges[index], this.durations[index]);
                moveRight(); // Go right after finishing left movement
            };

            const moveRight = async () => {
                spider.flipX = false
                await this.crawl(spider, this.ranges[index], this.durations[index]);
                moveLeft(); // Go left after finishing right movement
            };

            moveLeft();
        }
    }
    enablePassthrough() {
        for (const spider of this.spiders) {
            spider.onBeforePhysicsResolve((collision) => {
                if (collision.target.is("passthrough") && spider.isJumping()) {
                    collision.preventResolution();
                }
            });
        }
    }
}