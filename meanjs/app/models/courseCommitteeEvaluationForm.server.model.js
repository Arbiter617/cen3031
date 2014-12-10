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
	courseCommitteeParticipants: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	/*
	term: {
		type: String,
		trim: true,
		default: '',
		required: true
	},
	*/
	date: {
		type: Date,
		trim: true,
		default: Date.now,
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
	}
});

mongoose.model('CourseCommitteeEvaluationForm', CourseCommitteeEvaluationFormSchema);