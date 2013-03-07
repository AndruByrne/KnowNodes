/*** Generated by streamline 0.4.5 (callbacks) - DO NOT EDIT ***/ var __rt=require('streamline/lib/callbacks/runtime').runtime(__filename),__func=__rt.__func,__cb=__rt.__cb; (function() {













  var BaseModule, Concept, relationModule, __bind = function(fn, me) {
    return function() { return fn.apply(me, arguments); };
  }, __hasProp = { }.hasOwnProperty, __extends = function(child, parent) {
    for (var key in parent) { if (__hasProp.call(parent, key)) { child[key] = parent[key]; }; }; function ctor() { this.constructor = child; }; ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BaseModule = require("./baseModule");

  relationModule = require("./relation");

  module.exports = Concept = (function(_super) {

    __extends(Concept, _super);

    function Concept(user) {
      this.deleteConcept = __bind(this.deleteConcept, this);

      this.createNewConcept = __bind(this.createNewConcept, this);

      this.getConceptById = __bind(this.getConceptById, this);

      this.getAllConcepts = __bind(this.getAllConcepts, this);
      Concept.__super__.constructor.call(this, user);
      this.relation = new relationModule(user); };


    Concept.prototype.getAllConcepts = function Concept_prototype_getAllConcepts__1(_) { var conceptType, concepts, params, __this = this; var __frame = { name: "Concept_prototype_getAllConcepts__1", line: 40 }; return __func(_, this, arguments, Concept_prototype_getAllConcepts__1, 0, __frame, function __$Concept_prototype_getAllConcepts__1() {

        conceptType = __this.DB.getPostTypes().concept;
        concepts = [];
        params = {
          where: {
            postType: conceptType } };


        return __this.DB.Post.all(params, __cb(_, __frame, 9, 6, function ___(__0, __2) { return __2.forEach_(__cb(_, __frame, 9, 6, function __$Concept_prototype_getAllConcepts__1() {







            return _(null, concepts); }, true), function __1(_, concept) { var __frame = { name: "__1", line: 49 }; return __func(_, this, arguments, __1, 0, __frame, function __$__1() { return _(null, concepts.push({ id: concept.id, conceptId: concept.KN_ID, title: concept.title, content: concept.bodyText })); }); }); }, true)); }); };


    Concept.prototype.getUserConcepts = function Concept_prototype_getUserConcepts__2(_) { var params, query, __this = this; var __frame = { name: "Concept_prototype_getUserConcepts__2", line: 60 }; return __func(_, this, arguments, Concept_prototype_getUserConcepts__2, 0, __frame, function __$Concept_prototype_getUserConcepts__2() {

        query = ["START user=node({userId})","MATCH (concept) -[:CREATED_BY]-> (user)","WHERE (concept.postType = \"{conceptType}\")","RETURN other",].join("\n");
        params = {
          userId: __this.user.id,
          conceptType: __this.DB.getPostTypes().concept };

        return __this.neo4jDB.query(query, params, __cb(_, __frame, 7, 13, _, true)); }); };


    Concept.prototype.getConceptById = function Concept_prototype_getConceptById__3(nodeId, _) { var concept, __this = this; var __frame = { name: "Concept_prototype_getConceptById__3", line: 70 }; return __func(_, this, arguments, Concept_prototype_getConceptById__3, 1, __frame, function __$Concept_prototype_getConceptById__3() {

        return __this.DB.Post.find(nodeId, __cb(_, __frame, 2, 16, function ___(__0, __1) { concept = __1;
          return _(null, concept); }, true)); }); };


    Concept.prototype.getConceptByKnownodeId = function Concept_prototype_getConceptByKnownodeId__4(knownodeId, _) { var concept, params, returnConcept, __this = this; var __frame = { name: "Concept_prototype_getConceptByKnownodeId__4", line: 76 }; return __func(_, this, arguments, Concept_prototype_getConceptByKnownodeId__4, 1, __frame, function __$Concept_prototype_getConceptByKnownodeId__4() {

        params = {
          where: {
            KN_ID: knownodeId } };


        return __this.DB.Post.findOne(params, __cb(_, __frame, 7, 16, function ___(__0, __1) { concept = __1;
          if (concept) {
            returnConcept = {
              id: concept.id,
              conceptId: concept.KN_ID,
              title: concept.title,
              bodyText: concept.bodyText };

            return _(null, returnConcept); }
           else {
            return _(null, null); } ; _(); }, true)); }); };



    Concept.prototype.createNewConcept = function Concept_prototype_createNewConcept__5(conceptObject, _) { var concept, __this = this; var __frame = { name: "Concept_prototype_createNewConcept__5", line: 97 }; return __func(_, this, arguments, Concept_prototype_createNewConcept__5, 1, __frame, function __$Concept_prototype_createNewConcept__5() {

        conceptObject.postType = __this.DB.getPostTypes().concept;
        return __this.DB.Post.create(conceptObject, __cb(_, __frame, 3, 16, function ___(__0, __1) { concept = __1;
          return concept.index("kn_Post", "KN_ID", concept.KN_ID, __cb(_, __frame, 4, 6, function __$Concept_prototype_createNewConcept__5() {
            __this.relation.createOwnerRelationship(concept);
            return _(null, concept); }, true)); }, true)); }); };


    Concept.prototype.deleteConcept = function Concept_prototype_deleteConcept__6(conceptId, _) { var concept, __this = this; var __frame = { name: "Concept_prototype_deleteConcept__6", line: 106 }; return __func(_, this, arguments, Concept_prototype_deleteConcept__6, 1, __frame, function __$Concept_prototype_deleteConcept__6() {

        return __this.DB.Post.find(nodeId, __cb(_, __frame, 2, 16, function ___(__0, __1) { concept = __1;
          return concept.destroy(__cb(_, __frame, 3, 13, _, true)); }, true)); }); };


    return Concept;

  })(BaseModule);

}).call(this);