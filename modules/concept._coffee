###
* User: Liad Magen
* Date: 16/01/13
* Time: 00:30
*
* Concept represents a special type of knwonode Post which is a category or a concept in the system.
* It saves/displays the same way as a post - just that we use the type of concept
* and it lacks a files (for now).
* since it currently has a special meaning with a designated page, it gets its own API code. Lucky him.
###

relationModule = require './relation'
DBModule = require './DBModule'

module.exports = class Concept extends DBModule
	constructor: (user) ->
		super user
		@relation = new relationModule user
		@currentModule = 'module/Concept'

	# return all concepts
	getAllConcepts: (_) =>
		@logger.logDebug @currentModule, "getAllConcepts"
		conceptType = @DB.getPostTypes().concept
		concepts = []
		params = where:
			postType: conceptType

		@DB.Post.all(params, _).forEach_(_, (_, concept) ->
			concepts.push(
				             id: concept.id,
				             conceptId: concept.KN_ID,
				             title: concept.title,
				             content: concept.bodyText))

		return concepts

	getUserConcepts: (_) ->
		@logger.logDebug @currentModule, "getUserConcepts"
		query = [
			'START user=node({userId})',
			'MATCH (concept) -[:CREATED_BY]-> (user)',
			'WHERE (concept.postType = "{conceptType}")',
			'RETURN other'
		].join('\n');

		params =
			userId: @user.id,
			conceptType: @DB.getPostTypes().concept

		@neo4jDB.query query, params, _

	getConceptById: (nodeId, _) =>
		@logger.logDebug @currentModule, "getConceptById #{nodeId}"
		concept = @DB.Post.find nodeId, _
		return concept;

	# return concept by knownode-Id
	getConceptByKnownodeId: (knownodeId, _) ->
		@logger.logDebug @currentModule, "getConceptByKnownodeId #{knownodeId}"
		params = where:
			KN_ID: knownodeId

		concept = @DB.Post.findOne(params, _)
		if concept
			returnConcept =
				id: concept.id,
				conceptId: concept.KN_ID,
				title: concept.title,
				bodyText: concept.bodyText
			return returnConcept
		else
			return null

	createNewConcept: (conceptObject, _) =>
		# we'll set hard-coded the post type to be a concept
		@logger.logDebug @currentModule, 'createNewConcept'
		conceptObject.postType = @DB.getPostTypes().concept;
		concept = @DB.Post.create conceptObject, _
		concept.index 'kn_Post', 'KN_ID', concept.KN_ID, _
		@relation.createOwnerRelationship concept
		return concept

	saveConcept: (conceptKNId, conceptObject, _) =>
		# we'll set hard-coded the post type to be a concept
		@logger.logDebug @currentModule, 'saveConcept'
		params = where:
			KN_ID: knownodeId

		concept = @DB.Post.findOne(params, _)

		concept.title = conceptObject.title
		concept.url = conceptObject.url
		concept.bodyText = conceptObject.bodyText

		concept = concept.save _

	deleteConcept: (conceptId, _) =>
		@logger.logDebug @currentModule, "deleteConcept #{conceptId}"
		concept = @DB.Post.find nodeId, _
		concept.destroy _