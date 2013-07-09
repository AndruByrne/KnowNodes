*** Global query that updates link relevances (times out in console) ***

START root = node(*) 
MATCH (root)-->(link)-->(friend)
WHERE root.nodeType! = "kn_Post" 
  AND link.nodeType! = "kn_Edge"
  AND friend.nodeType! = "kn_Post"
WITH root, link, friend

MATCH (root)-->(linkA)-->(common)-->(linkB)-->(friend)
WHERE 
  linkA.nodeType! = "kn_Edge"
  AND common.nodeType! = "kn_Post" 
  AND linkB.nodeType! = "kn_Edge"
WITH root, link, friend, count(DISTINCT common) as commonCount

MATCH (root)-->(linkC)-->(other)
WHERE 
  linkC.nodeType! = "kn_Edge"
  AND other.nodeType! = "kn_Post" 
WITH root, link, friend, commonCount, count(DISTINCT other) as totalCount

SET link.relevance = commonCount * 1.0 / totalCount

RETURN root, friend, commonCount, totalCount, link.relevance 

*** As shorter query (also times out) ***

START root = node(*) 
MATCH (root)-->(link)-->(friend), 
  (root)-->(linkA)-->(common)-->(linkB)-->(friend),
  (root)-->(linkC)-->(other)
WHERE root.nodeType! = "kn_Post" 
  AND link.nodeType! = "kn_Edge"
  AND friend.nodeType! = "kn_Post"
  AND linkA.nodeType! = "kn_Edge"
  AND common.nodeType! = "kn_Post" 
  AND linkB.nodeType! = "kn_Edge"
  AND linkC.nodeType! = "kn_Edge"
  AND other.nodeType! = "kn_Post" 
WITH root, link, friend, count(DISTINCT other) as totalCount, count(DISTINCT common) as commonCount
SET link.relevance = commonCount * 1.0 / totalCount
RETURN root, friend, commonCount, totalCount, link.relevance 

*** Long query with limits to avoid timeout ***

START root = node(*) 
MATCH (root)-->(link)-->(friend)
WHERE root.nodeType! = "kn_Post" 
  AND link.nodeType! = "kn_Edge"
  AND friend.nodeType! = "kn_Post"
  AND id(root) >= 500
  AND id(root) < 1000
WITH root, link, friend

MATCH (root)-->(linkA)-->(common)-->(linkB)-->(friend)
WHERE 
  linkA.nodeType! = "kn_Edge"
  AND common.nodeType! = "kn_Post" 
  AND linkB.nodeType! = "kn_Edge"
WITH root, link, friend, count(DISTINCT common) as commonCount

MATCH (root)-->(linkC)-->(other)
WHERE 
  linkC.nodeType! = "kn_Edge"
  AND other.nodeType! = "kn_Post" 
WITH root, link, friend, commonCount, count(DISTINCT other) as totalCount

SET link.relevance = commonCount * 1.0 / totalCount

RETURN root, friend, commonCount, totalCount, link.relevance

*** A few sample ids ***

artificial intelligence = 1334, e4f9e2ee-1b23-4e10-b059-2d955fc3810c
javascript = 45, f565f87d-6956-4010-a18d-12fadeabe78e

*** All titles ***

START root = node(*) 
WHERE root.nodeType! = "kn_Post" 
RETURN id(root), root.KN_ID, root.title
ORDER BY root.title

*** List relevancies ***

START root = node(*) 
MATCH (root)-->(link)-->(friend)
WHERE root.nodeType! = "kn_Post" 
  AND link.nodeType! = "kn_Edge"
  AND friend.nodeType! = "kn_Post"
  AND HAS(link.relevance)
  AND root.KN_ID = "e4f9e2ee-1b23-4e10-b059-2d955fc3810c"
RETURN root.title, friend.title, link.relevance
ORDER BY link.relevance DESC

*** Shortest path between two nodes ***

START ai = node(1334), js = node(45)
MATCH p = allShortestPaths((ai)-[:RELATED_TO*]-(js))
RETURN EXTRACT(x in FILTER(x IN p: HAS(x.title)) : x.title)

** Shortest path between one node and every other ***

START ai = node(1334), other = node(*)
MATCH p = allShortestPaths((ai)-[:RELATED_TO*]->(other))
WHERE other.nodeType! = "kn_Post" 
RETURN other.title, EXTRACT(x in FILTER(x IN p: HAS(x.title)) : x.title) as path

** Shortest path between one node and every other, calculating path relevancies ***

START ai = node(1334), other = node(*)
MATCH p = allShortestPaths((ai)-[:RELATED_TO*]->(other))
WHERE other.nodeType! = "kn_Post" 
RETURN other.title, EXTRACT(x in FILTER(x IN p: HAS(x.title)) : x.title) as path,
  REDUCE(rel = 1, x in FILTER(x IN p: HAS(x.relevance)) : rel * x.relevance) as relevance
ORDER BY other.title, relevance DESC
