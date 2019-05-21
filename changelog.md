# 1.0.0

Add link to blog post and increment version to `1.0.0`.

# 0.2.3

Fix ratelimit handling. If there are over 300 bills, loop gets set to 299 tweets and starts by sending out the ratelimit message.

# 0.2.2

Add a function to construct tweet text and keep it within 280 characters.

# 0.2.1

Add a ratelimit message if we have over 300 bills.

# 0.2.0

Switch over to the `https` module instead of [Axios](https://github.com/axios/axios).

# 0.1.0

MVP working code.
