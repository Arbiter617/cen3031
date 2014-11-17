'use strict';

/**
*Module Dependencies
*/
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
* CourseCommitteeEvaluationForm Schema
*/
var CourseCommitteeEvaluationFormSchema = new Schema({
	/*
		For now I'll just have this as a string, but eventually might need 
		to be a list of users or instructors or something.
	*/
	courseCommitteeParticipants: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	date: {
		type: Date,
		trim: true,
		default: Date.now,
		required: true
	},
	outcome: {
		type: Number,
		default: 0,
		required: true
	},
	description: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	/*
		Start of the yes or no questions
	*/
	syllabusReflectCurrentContent: {
		type: Boolean,
		required: true,
		default: false
	},
	droppedTopics: {
		type: Boolean,
		required: true,
		default: false
	},
	addedTopics: {
		type: Boolean,
		required: true,
		default: false
	},
	//Next set of questions
	textbookWorkingWell: {
		type: Boolean,
		required: true,
		default: false
	},
	changesRequiredForNextAcademicYear: {
		type: Boolean,
		required: true,
		default: false
	},
	newBooksToBeEvaluated: {
		type: Boolean,
		required: true,
		default: false
	},
	bookMapWellToSyllabus: {
		type: Boolean,
		required: true,
		default: false
	},
	//next set of questions
	otherEvaluationsIndicateIssues: {
		type: Boolean,
		required: true,
		default: false
	},
	//next set
	didStudentsMasterMaterial: {
		type: Boolean,
		required: true,
		default: false
	},
	problemsWithKnowledgeInKeyConcepts: {
		type: Boolean,
		required: true,
		default: false
	},
	//Section II
	prereqsStillAppropriate: {
		type: Boolean,
		required: true,
		default: false
	},
	satisfyNeedsOfFollowupCourses: {
		type: Boolean,
		required: true,
		default: false
	},
	/*
		End of questions
	*/
	/*
		Start of textBoxes
	*/
	//Section I
	sectionIActionsRecommendations: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	//Section II
	sectionIIActionsRecommendations: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	//Section III
	recommendationsForCourseImprovement: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	recommendationsToCENProgramGovernance: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	sectionIIIRecommendationsComments: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	//Not sure how nesting objects works with handlebars but I think
	//it could work like courseOutcomeAssessmentForm.courseTitle
	//might refactor courseOutcomeAssessmentForm based off of front ends
	//course schema. We'll see.
	courseOutcomeAssessmentForm: { 
		type: Schema.Types.ObjectId,
		ref: 'CourseOutcomeAssessmentForm'
	}
	
});

mongoose.model('CourseCommitteeEvaluationForm', CourseCommitteeEvaluationFormSchema);