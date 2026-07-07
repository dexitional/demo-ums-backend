import { relations } from "drizzle-orm/relations";
import { app, appToprovider, provider, staff, activityBacklog, scheme, session, student, activityDefer, program, activityProgchange, activityProgress, activityRegister, course, assessment, graduate, graduateSession, major, mode, unit, resit, resitSession, sheet, structmeta, structure, country, disability, marital, region, religion, title, transwift, transaction, admissionLetter, admission, applicant, applyType, stepChoice, stepProfile, stage, instituteCategory, certCategory, category, amsForm, fresher, bill, gradeWeight, amsPrice, sorted, documentCategory, stepDocument, stepEducation, stepGrade, stepResult, subject, relation, stepGuardian, stepReferee, voucher, vendor, evaluation, evaluationResponse, evaluationOption, evaluationQuestion, election, attack, portfolio, candidate, group, elector, activityBill, user, activityFinanceVoucher, bankacc, charge, studentAccount, collector, transtype, upload, circular, formType, form, leave, leaveCategory, leaveApprover, leaveBalance, leaveDefer, leaveWeight, nss, option, question, positionInfo, position, scale, job, promotion, section, relative, respondent, response, transfer, appRole, userRole } from "./schema";

export const appToproviderRelations = relations(appToprovider, ({one}) => ({
	app: one(app, {
		fields: [appToprovider.a],
		references: [app.id]
	}),
	provider: one(provider, {
		fields: [appToprovider.b],
		references: [provider.providerId]
	}),
}));

export const ssoAppRelations = relations(app, ({many}) => ({
	appToproviders: many(appToprovider),
	ssoAroles: many(appRole),
}));

export const ssoProviderRelations = relations(provider, ({one, many}) => ({
	appToproviders: many(appToprovider),
	user: one(user, {
		fields: [provider.userId],
		references: [user.id]
	}),
}));

export const aisActivityBacklogRelations = relations(activityBacklog, ({one}) => ({
	hrsStaff_approvedBy: one(staff, {
		fields: [activityBacklog.approvedBy],
		references: [staff.staffNo],
		relationName: "aisActivityBacklog_approvedBy_hrsStaff_staffNo"
	}),
	hrsStaff_createdBy: one(staff, {
		fields: [activityBacklog.createdBy],
		references: [staff.staffNo],
		relationName: "aisActivityBacklog_createdBy_hrsStaff_staffNo"
	}),
	scheme: one(scheme, {
		fields: [activityBacklog.schemeId],
		references: [scheme.id]
	}),
	session: one(session, {
		fields: [activityBacklog.sessionId],
		references: [session.id]
	}),
}));

export const hrsStaffRelations = relations(staff, ({one, many}) => ({
	aisActivityBacklogs_approvedBy: many(activityBacklog, {
		relationName: "aisActivityBacklog_approvedBy_hrsStaff_staffNo"
	}),
	aisActivityBacklogs_createdBy: many(activityBacklog, {
		relationName: "aisActivityBacklog_createdBy_hrsStaff_staffNo"
	}),
	aisSheets_assessorId: many(sheet, {
		relationName: "aisSheet_assessorId_hrsStaff_staffNo"
	}),
	aisSheets_assignStaffId: many(sheet, {
		relationName: "aisSheet_assignStaffId_hrsStaff_staffNo"
	}),
	aisSheets_certifierId: many(sheet, {
		relationName: "aisSheet_certifierId_hrsStaff_staffNo"
	}),
	aisTranswifts: many(transwift),
	evaluations: many(evaluation),
	hrsLeaves_approverId: many(leave, {
		relationName: "hrsLeave_approverId_hrsStaff_staffNo"
	}),
	hrsLeaves_relieverId: many(leave, {
		relationName: "hrsLeave_relieverId_hrsStaff_staffNo"
	}),
	hrsLeaves_staffId: many(leave, {
		relationName: "hrsLeave_staffId_hrsStaff_staffNo"
	}),
	hrsLeaves_supervisorId: many(leave, {
		relationName: "hrsLeave_supervisorId_hrsStaff_staffNo"
	}),
	hrsLeaveApprovers: many(leaveApprover),
	hrsLeaveBalances: many(leaveBalance),
	hrsLeaveDefers_approverId: many(leaveDefer, {
		relationName: "hrsLeaveDefer_approverId_hrsStaff_staffNo"
	}),
	hrsLeaveDefers_staffId: many(leaveDefer, {
		relationName: "hrsLeaveDefer_staffId_hrsStaff_staffNo"
	}),
	hrsLeaveDefers_supervisorId: many(leaveDefer, {
		relationName: "hrsLeaveDefer_supervisorId_hrsStaff_staffNo"
	}),
	hrsPositions: many(position, {
		relationName: "hrsPosition_staffNo_hrsStaff_staffNo"
	}),
	hrsPromotions: many(promotion, {
		relationName: "hrsPromotion_staffNo_hrsStaff_staffNo"
	}),
	hrsRelatives: many(relative),
	hrsRespondents_staffId: many(respondent, {
		relationName: "hrsRespondent_staffId_hrsStaff_staffNo"
	}),
	hrsRespondents_supervisorId: many(respondent, {
		relationName: "hrsRespondent_supervisorId_hrsStaff_staffNo"
	}),
	country: one(country, {
		fields: [staff.countryId],
		references: [country.id]
	}),
	hrsPromotion_firstOfferId: one(promotion, {
		fields: [staff.firstOfferId],
		references: [promotion.id],
		relationName: "hrsStaff_firstOfferId_hrsPromotion_id"
	}),
	job: one(job, {
		fields: [staff.jobId],
		references: [job.id]
	}),
	marital: one(marital, {
		fields: [staff.maritalId],
		references: [marital.id]
	}),
	position: one(position, {
		fields: [staff.positionId],
		references: [position.id],
		relationName: "hrsStaff_positionId_hrsPosition_id"
	}),
	hrsPromotion_promotionId: one(promotion, {
		fields: [staff.promotionId],
		references: [promotion.id],
		relationName: "hrsStaff_promotionId_hrsPromotion_id"
	}),
	region: one(region, {
		fields: [staff.regionId],
		references: [region.id]
	}),
	religion: one(religion, {
		fields: [staff.religionId],
		references: [religion.id]
	}),
	title: one(title, {
		fields: [staff.titleId],
		references: [title.id]
	}),
	unit: one(unit, {
		fields: [staff.unitId],
		references: [unit.id]
	}),
	hrsTransfers_approverId: many(transfer, {
		relationName: "hrsTransfer_approverId_hrsStaff_staffNo"
	}),
	hrsTransfers_creatorId: many(transfer, {
		relationName: "hrsTransfer_creatorId_hrsStaff_staffNo"
	}),
	hrsTransfers_staffId: many(transfer, {
		relationName: "hrsTransfer_staffId_hrsStaff_staffNo"
	}),
}));

export const aisSchemeRelations = relations(scheme, ({many}) => ({
	aisActivityBacklogs: many(activityBacklog),
	aisAssessments: many(assessment),
	aisPrograms: many(program),
	aisResits: many(resit),
}));

export const aisSessionRelations = relations(session, ({many}) => ({
	aisActivityBacklogs: many(activityBacklog),
	aisActivityDefers: many(activityDefer),
	aisActivityProgchanges: many(activityProgchange),
	aisActivityProgresses: many(activityProgress),
	aisActivityRegisters: many(activityRegister),
	aisAssessments: many(assessment),
	aisResits_registerSessionId: many(resit, {
		relationName: "aisResit_registerSessionId_aisSession_id"
	}),
	aisResits_trailSessionId: many(resit, {
		relationName: "aisResit_trailSessionId_aisSession_id"
	}),
	aisSheets: many(sheet),
	amsAdmissions: many(admission),
	amsFreshers: many(fresher),
	evaluations: many(evaluation),
	fmsBills: many(bill),
	fmsStudaccounts: many(studentAccount),
}));

export const aisActivityDeferRelations = relations(activityDefer, ({one}) => ({
	student: one(student, {
		fields: [activityDefer.indexno],
		references: [student.indexno]
	}),
	session: one(session, {
		fields: [activityDefer.sessionId],
		references: [session.id]
	}),
}));

export const aisStudentRelations = relations(student, ({one, many}) => ({
	aisActivityDefers: many(activityDefer),
	aisActivityProgchanges: many(activityProgchange),
	aisActivityProgresses: many(activityProgress),
	aisActivityRegisters: many(activityRegister),
	aisAssessments: many(assessment),
	aisGraduates: many(graduate),
	aisResits: many(resit),
	country_countryId: one(country, {
		fields: [student.countryId],
		references: [country.id],
		relationName: "aisStudent_countryId_country_id"
	}),
	disability: one(disability, {
		fields: [student.disabilityId],
		references: [disability.id]
	}),
	major: one(major, {
		fields: [student.majorId],
		references: [major.id]
	}),
	marital: one(marital, {
		fields: [student.maritalId],
		references: [marital.id]
	}),
	country_nationalityId: one(country, {
		fields: [student.nationalityId],
		references: [country.id],
		relationName: "aisStudent_nationalityId_country_id"
	}),
	program: one(program, {
		fields: [student.programId],
		references: [program.id]
	}),
	region: one(region, {
		fields: [student.regionId],
		references: [region.id]
	}),
	religion: one(religion, {
		fields: [student.religionId],
		references: [religion.id]
	}),
	title: one(title, {
		fields: [student.titleId],
		references: [title.id]
	}),
	aisTranswifts: many(transwift),
	amsFreshers: many(fresher),
	evaluations: many(evaluation),
	fmsCharges: many(charge),
	fmsStudaccounts: many(studentAccount),
	fmsTransactions: many(transaction),
}));

export const aisActivityProgchangeRelations = relations(activityProgchange, ({one}) => ({
	aisProgram_newProgramId: one(program, {
		fields: [activityProgchange.newProgramId],
		references: [program.id],
		relationName: "aisActivityProgchange_newProgramId_aisProgram_id"
	}),
	aisProgram_oldProgramId: one(program, {
		fields: [activityProgchange.oldProgramId],
		references: [program.id],
		relationName: "aisActivityProgchange_oldProgramId_aisProgram_id"
	}),
	session: one(session, {
		fields: [activityProgchange.sessionId],
		references: [session.id]
	}),
	student: one(student, {
		fields: [activityProgchange.studentId],
		references: [student.id]
	}),
}));

export const aisProgramRelations = relations(program, ({one, many}) => ({
	aisActivityProgchanges_newProgramId: many(activityProgchange, {
		relationName: "aisActivityProgchange_newProgramId_aisProgram_id"
	}),
	aisActivityProgchanges_oldProgramId: many(activityProgchange, {
		relationName: "aisActivityProgchange_oldProgramId_aisProgram_id"
	}),
	aisMajors: many(major),
	mode: one(mode, {
		fields: [program.modeId],
		references: [mode.id]
	}),
	scheme: one(scheme, {
		fields: [program.schemeId],
		references: [scheme.id]
	}),
	unit: one(unit, {
		fields: [program.unitId],
		references: [unit.id]
	}),
	aisSheets: many(sheet),
	aisStructmetas: many(structmeta),
	aisStructures: many(structure),
	aisStudents: many(student),
	amsFreshers: many(fresher),
	amsStepChoices: many(stepChoice),
	fmsBills: many(bill),
}));

export const aisActivityProgressRelations = relations(activityProgress, ({one}) => ({
	student: one(student, {
		fields: [activityProgress.indexno],
		references: [student.indexno]
	}),
	session: one(session, {
		fields: [activityProgress.sessionId],
		references: [session.id]
	}),
}));

export const aisActivityRegisterRelations = relations(activityRegister, ({one}) => ({
	student: one(student, {
		fields: [activityRegister.indexno],
		references: [student.indexno]
	}),
	session: one(session, {
		fields: [activityRegister.sessionId],
		references: [session.id]
	}),
}));

export const aisAssessmentRelations = relations(assessment, ({one}) => ({
	course: one(course, {
		fields: [assessment.courseId],
		references: [course.id]
	}),
	student: one(student, {
		fields: [assessment.indexno],
		references: [student.indexno]
	}),
	scheme: one(scheme, {
		fields: [assessment.schemeId],
		references: [scheme.id]
	}),
	session: one(session, {
		fields: [assessment.sessionId],
		references: [session.id]
	}),
}));

export const aisCourseRelations = relations(course, ({many}) => ({
	aisAssessments: many(assessment),
	aisResits: many(resit),
	aisSheets: many(sheet),
	aisStructures: many(structure),
	evaluations: many(evaluation),
}));

export const aisGraduateRelations = relations(graduate, ({one}) => ({
	student: one(student, {
		fields: [graduate.indexno],
		references: [student.indexno]
	}),
	graduateSession: one(graduateSession, {
		fields: [graduate.sessionId],
		references: [graduateSession.id]
	}),
}));

export const aisGraduateSessionRelations = relations(graduateSession, ({many}) => ({
	aisGraduates: many(graduate),
}));

export const aisMajorRelations = relations(major, ({one, many}) => ({
	program: one(program, {
		fields: [major.programId],
		references: [program.id]
	}),
	aisSheets: many(sheet),
	aisStructmetas: many(structmeta),
	aisStructures: many(structure),
	aisStudents: many(student),
	amsFreshers: many(fresher),
	amsStepChoices: many(stepChoice),
}));

export const modeRelations = relations(mode, ({many}) => ({
	aisPrograms: many(program),
}));

export const unitRelations = relations(unit, ({one, many}) => ({
	aisPrograms: many(program),
	aisSheets: many(sheet),
	aisStructures: many(structure),
	fmsBankaccs: many(bankacc),
	hrsNsses: many(nss),
	hrsPositionInfos: many(positionInfo),
	hrsStaffs: many(staff),
	hrsTransfers_fromUnitId: many(transfer, {
		relationName: "hrsTransfer_fromUnitId_unit_id"
	}),
	hrsTransfers_toUnitId: many(transfer, {
		relationName: "hrsTransfer_toUnitId_unit_id"
	}),
	unit_level1Id: one(unit, {
		fields: [unit.level1Id],
		references: [unit.id],
		relationName: "unit_level1Id_unit_id"
	}),
	units_level1Id: many(unit, {
		relationName: "unit_level1Id_unit_id"
	}),
	unit_level2Id: one(unit, {
		fields: [unit.level2Id],
		references: [unit.id],
		relationName: "unit_level2Id_unit_id"
	}),
	units_level2Id: many(unit, {
		relationName: "unit_level2Id_unit_id"
	}),
	unit_level3Id: one(unit, {
		fields: [unit.level3Id],
		references: [unit.id],
		relationName: "unit_level3Id_unit_id"
	}),
	units_level3Id: many(unit, {
		relationName: "unit_level3Id_unit_id"
	}),
}));

export const aisResitRelations = relations(resit, ({one}) => ({
	course: one(course, {
		fields: [resit.courseId],
		references: [course.id]
	}),
	student: one(student, {
		fields: [resit.indexno],
		references: [student.indexno]
	}),
	aisSession_registerSessionId: one(session, {
		fields: [resit.registerSessionId],
		references: [session.id],
		relationName: "aisResit_registerSessionId_aisSession_id"
	}),
	scheme: one(scheme, {
		fields: [resit.schemeId],
		references: [scheme.id]
	}),
	resitSession: one(resitSession, {
		fields: [resit.sessionId],
		references: [resitSession.id]
	}),
	aisSession_trailSessionId: one(session, {
		fields: [resit.trailSessionId],
		references: [session.id],
		relationName: "aisResit_trailSessionId_aisSession_id"
	}),
}));

export const aisResitSessionRelations = relations(resitSession, ({many}) => ({
	aisResits: many(resit),
}));

export const aisSheetRelations = relations(sheet, ({one}) => ({
	hrsStaff_assessorId: one(staff, {
		fields: [sheet.assessorId],
		references: [staff.staffNo],
		relationName: "aisSheet_assessorId_hrsStaff_staffNo"
	}),
	hrsStaff_assignStaffId: one(staff, {
		fields: [sheet.assignStaffId],
		references: [staff.staffNo],
		relationName: "aisSheet_assignStaffId_hrsStaff_staffNo"
	}),
	hrsStaff_certifierId: one(staff, {
		fields: [sheet.certifierId],
		references: [staff.staffNo],
		relationName: "aisSheet_certifierId_hrsStaff_staffNo"
	}),
	course: one(course, {
		fields: [sheet.courseId],
		references: [course.id]
	}),
	major: one(major, {
		fields: [sheet.majorId],
		references: [major.id]
	}),
	program: one(program, {
		fields: [sheet.programId],
		references: [program.id]
	}),
	session: one(session, {
		fields: [sheet.sessionId],
		references: [session.id]
	}),
	unit: one(unit, {
		fields: [sheet.unitId],
		references: [unit.id]
	}),
}));

export const aisStructmetaRelations = relations(structmeta, ({one}) => ({
	major: one(major, {
		fields: [structmeta.majorId],
		references: [major.id]
	}),
	program: one(program, {
		fields: [structmeta.programId],
		references: [program.id]
	}),
}));

export const aisStructureRelations = relations(structure, ({one}) => ({
	course: one(course, {
		fields: [structure.courseId],
		references: [course.id]
	}),
	major: one(major, {
		fields: [structure.majorId],
		references: [major.id]
	}),
	program: one(program, {
		fields: [structure.programId],
		references: [program.id]
	}),
	unit: one(unit, {
		fields: [structure.unitId],
		references: [unit.id]
	}),
}));

export const countryRelations = relations(country, ({many}) => ({
	aisStudents_countryId: many(student, {
		relationName: "aisStudent_countryId_country_id"
	}),
	aisStudents_nationalityId: many(student, {
		relationName: "aisStudent_nationalityId_country_id"
	}),
	amsStepProfiles_countryId: many(stepProfile, {
		relationName: "amsStepProfile_countryId_country_id"
	}),
	amsStepProfiles_nationalityId: many(stepProfile, {
		relationName: "amsStepProfile_nationalityId_country_id"
	}),
	hrsNsses: many(nss),
	hrsStaffs: many(staff),
}));

export const disabilityRelations = relations(disability, ({many}) => ({
	aisStudents: many(student),
	amsStepProfiles: many(stepProfile),
}));

export const maritalRelations = relations(marital, ({many}) => ({
	aisStudents: many(student),
	amsStepProfiles: many(stepProfile),
	hrsNsses: many(nss),
	hrsStaffs: many(staff),
}));

export const regionRelations = relations(region, ({many}) => ({
	aisStudents: many(student),
	amsStepProfiles: many(stepProfile),
	hrsNsses: many(nss),
	hrsStaffs: many(staff),
}));

export const religionRelations = relations(religion, ({many}) => ({
	aisStudents: many(student),
	amsStepProfiles: many(stepProfile),
	hrsNsses: many(nss),
	hrsStaffs: many(staff),
}));

export const titleRelations = relations(title, ({many}) => ({
	aisStudents: many(student),
	amsStepGuardians: many(stepGuardian),
	amsStepProfiles: many(stepProfile),
	amsStepReferees: many(stepReferee),
	hrsNsses: many(nss),
	hrsRelatives: many(relative),
	hrsStaffs: many(staff),
}));

export const aisTranswiftRelations = relations(transwift, ({one}) => ({
	staff: one(staff, {
		fields: [transwift.issuerId],
		references: [staff.staffNo]
	}),
	student: one(student, {
		fields: [transwift.studentId],
		references: [student.id]
	}),
	transaction: one(transaction, {
		fields: [transwift.transactId],
		references: [transaction.id]
	}),
}));

export const fmsTransactionRelations = relations(transaction, ({one, many}) => ({
	aisTranswifts: many(transwift),
	fmsActivityVouchers: many(activityFinanceVoucher),
	fmsStudaccounts: many(studentAccount),
	bankacc: one(bankacc, {
		fields: [transaction.bankaccId],
		references: [bankacc.id]
	}),
	collector: one(collector, {
		fields: [transaction.collectorId],
		references: [collector.id]
	}),
	student: one(student, {
		fields: [transaction.studentId],
		references: [student.id]
	}),
	transtype: one(transtype, {
		fields: [transaction.transtypeId],
		references: [transtype.id]
	}),
}));

export const amsAdmissionRelations = relations(admission, ({one, many}) => ({
	amsLetter_cpletterId: one(admissionLetter, {
		fields: [admission.cpletterId],
		references: [admissionLetter.id],
		relationName: "amsAdmission_cpletterId_amsLetter_id"
	}),
	amsLetter_dpletterId: one(admissionLetter, {
		fields: [admission.dpletterId],
		references: [admissionLetter.id],
		relationName: "amsAdmission_dpletterId_amsLetter_id"
	}),
	amsLetter_pgletterId: one(admissionLetter, {
		fields: [admission.pgletterId],
		references: [admissionLetter.id],
		relationName: "amsAdmission_pgletterId_amsLetter_id"
	}),
	session: one(session, {
		fields: [admission.sessionId],
		references: [session.id]
	}),
	amsLetter_ugletterId: one(admissionLetter, {
		fields: [admission.ugletterId],
		references: [admissionLetter.id],
		relationName: "amsAdmission_ugletterId_amsLetter_id"
	}),
	amsApplicants: many(applicant),
	amsFreshers: many(fresher),
	amsSorteds: many(sorted),
	amsVouchers: many(voucher),
	fmsActivityVouchers: many(activityFinanceVoucher),
}));

export const amsLetterRelations = relations(admissionLetter, ({one, many}) => ({
	amsAdmissions_cpletterId: many(admission, {
		relationName: "amsAdmission_cpletterId_amsLetter_id"
	}),
	amsAdmissions_dpletterId: many(admission, {
		relationName: "amsAdmission_dpletterId_amsLetter_id"
	}),
	amsAdmissions_pgletterId: many(admission, {
		relationName: "amsAdmission_pgletterId_amsLetter_id"
	}),
	amsAdmissions_ugletterId: many(admission, {
		relationName: "amsAdmission_ugletterId_amsLetter_id"
	}),
	amsFreshers: many(fresher),
	category: one(category, {
		fields: [admissionLetter.categoryId],
		references: [category.id]
	}),
}));

export const amsApplicantRelations = relations(applicant, ({one}) => ({
	admission: one(admission, {
		fields: [applicant.admissionId],
		references: [admission.id]
	}),
	applyType: one(applyType, {
		fields: [applicant.applyTypeId],
		references: [applyType.id]
	}),
	stepChoice: one(stepChoice, {
		fields: [applicant.choiceId],
		references: [stepChoice.id]
	}),
	stepProfile: one(stepProfile, {
		fields: [applicant.profileId],
		references: [stepProfile.serial]
	}),
	stage: one(stage, {
		fields: [applicant.stageId],
		references: [stage.id]
	}),
}));

export const amsApplytypeRelations = relations(applyType, ({many}) => ({
	amsApplicants: many(applicant),
	amsSorteds: many(sorted),
}));

export const amsStepChoiceRelations = relations(stepChoice, ({one, many}) => ({
	amsApplicants: many(applicant),
	amsSorteds_choice1Id: many(sorted, {
		relationName: "amsSorted_choice1Id_amsStepChoice_id"
	}),
	amsSorteds_choice2Id: many(sorted, {
		relationName: "amsSorted_choice2Id_amsStepChoice_id"
	}),
	major: one(major, {
		fields: [stepChoice.majorId],
		references: [major.id]
	}),
	program: one(program, {
		fields: [stepChoice.programId],
		references: [program.id]
	}),
}));

export const amsStepProfileRelations = relations(stepProfile, ({one, many}) => ({
	amsApplicants: many(applicant),
	amsSorteds: many(sorted),
	country_countryId: one(country, {
		fields: [stepProfile.countryId],
		references: [country.id],
		relationName: "amsStepProfile_countryId_country_id"
	}),
	disability: one(disability, {
		fields: [stepProfile.disabilityId],
		references: [disability.id]
	}),
	marital: one(marital, {
		fields: [stepProfile.maritalId],
		references: [marital.id]
	}),
	country_nationalityId: one(country, {
		fields: [stepProfile.nationalityId],
		references: [country.id],
		relationName: "amsStepProfile_nationalityId_country_id"
	}),
	region: one(region, {
		fields: [stepProfile.regionId],
		references: [region.id]
	}),
	religion: one(religion, {
		fields: [stepProfile.religionId],
		references: [religion.id]
	}),
	title: one(title, {
		fields: [stepProfile.titleId],
		references: [title.id]
	}),
}));

export const amsStageRelations = relations(stage, ({one, many}) => ({
	amsApplicants: many(applicant),
	amsSorteds: many(sorted),
	category: one(category, {
		fields: [stage.categoryId],
		references: [category.id]
	}),
	amsForm: one(amsForm, {
		fields: [stage.formId],
		references: [amsForm.id]
	}),
}));

export const amsCertCategoryRelations = relations(certCategory, ({one, many}) => ({
	instituteCategory: one(instituteCategory, {
		fields: [certCategory.instituteCategoryId],
		references: [instituteCategory.id]
	}),
	amsGradeWeights: many(gradeWeight),
	amsStepEducations: many(stepEducation),
	amsStepResults: many(stepResult),
}));

export const amsInstituteCategoryRelations = relations(instituteCategory, ({many}) => ({
	amsCertCategories: many(certCategory),
	amsStepEducations: many(stepEducation),
}));

export const amsFormRelations = relations(amsForm, ({one, many}) => ({
	category: one(category, {
		fields: [amsForm.categoryId],
		references: [category.id]
	}),
	amsStages: many(stage),
}));

export const amsCategoryRelations = relations(category, ({many}) => ({
	amsForms: many(amsForm),
	amsFreshers: many(fresher),
	amsLetters: many(admissionLetter),
	amsPrices: many(amsPrice),
	amsSorteds: many(sorted),
	amsStages: many(stage),
	amsVouchers: many(voucher),
}));

export const amsFresherRelations = relations(fresher, ({one}) => ({
	admission: one(admission, {
		fields: [fresher.admissionId],
		references: [admission.id]
	}),
	bill: one(bill, {
		fields: [fresher.billId],
		references: [bill.id]
	}),
	category: one(category, {
		fields: [fresher.categoryId],
		references: [category.id]
	}),
	admissionLetter: one(admissionLetter, {
		fields: [fresher.letterId],
		references: [admissionLetter.id]
	}),
	major: one(major, {
		fields: [fresher.majorId],
		references: [major.id]
	}),
	program: one(program, {
		fields: [fresher.programId],
		references: [program.id]
	}),
	student: one(student, {
		fields: [fresher.serial],
		references: [student.id]
	}),
	session: one(session, {
		fields: [fresher.sessionId],
		references: [session.id]
	}),
}));

export const fmsBillRelations = relations(bill, ({one, many}) => ({
	amsFreshers: many(fresher),
	fmsActivityBills: many(activityBill),
	bankacc: one(bankacc, {
		fields: [bill.bankaccId],
		references: [bankacc.id]
	}),
	program: one(program, {
		fields: [bill.programId],
		references: [program.id]
	}),
	session: one(session, {
		fields: [bill.sessionId],
		references: [session.id]
	}),
	fmsStudaccounts: many(studentAccount),
}));

export const amsGradeWeightRelations = relations(gradeWeight, ({one, many}) => ({
	certCategory: one(certCategory, {
		fields: [gradeWeight.certCategoryId],
		references: [certCategory.id]
	}),
	amsStepGrades: many(stepGrade),
}));

export const amsPriceRelations = relations(amsPrice, ({one}) => ({
	category: one(category, {
		fields: [amsPrice.categoryId],
		references: [category.id]
	}),
}));

export const amsSortedRelations = relations(sorted, ({one}) => ({
	admission: one(admission, {
		fields: [sorted.admissionId],
		references: [admission.id]
	}),
	applyType: one(applyType, {
		fields: [sorted.applyTypeId],
		references: [applyType.id]
	}),
	category: one(category, {
		fields: [sorted.categoryId],
		references: [category.id]
	}),
	amsStepChoice_choice1Id: one(stepChoice, {
		fields: [sorted.choice1Id],
		references: [stepChoice.id],
		relationName: "amsSorted_choice1Id_amsStepChoice_id"
	}),
	amsStepChoice_choice2Id: one(stepChoice, {
		fields: [sorted.choice2Id],
		references: [stepChoice.id],
		relationName: "amsSorted_choice2Id_amsStepChoice_id"
	}),
	stepProfile: one(stepProfile, {
		fields: [sorted.profileId],
		references: [stepProfile.serial]
	}),
	stage: one(stage, {
		fields: [sorted.stageId],
		references: [stage.id]
	}),
}));

export const amsStepDocumentRelations = relations(stepDocument, ({one}) => ({
	documentCategory: one(documentCategory, {
		fields: [stepDocument.documentCategoryId],
		references: [documentCategory.id]
	}),
}));

export const amsDocumentCategoryRelations = relations(documentCategory, ({many}) => ({
	amsStepDocuments: many(stepDocument),
}));

export const amsStepEducationRelations = relations(stepEducation, ({one}) => ({
	certCategory: one(certCategory, {
		fields: [stepEducation.certCategoryId],
		references: [certCategory.id]
	}),
	instituteCategory: one(instituteCategory, {
		fields: [stepEducation.instituteCategoryId],
		references: [instituteCategory.id]
	}),
}));

export const amsStepGradeRelations = relations(stepGrade, ({one}) => ({
	gradeWeight: one(gradeWeight, {
		fields: [stepGrade.gradeWeightId],
		references: [gradeWeight.id]
	}),
	stepResult: one(stepResult, {
		fields: [stepGrade.resultId],
		references: [stepResult.id]
	}),
	subject: one(subject, {
		fields: [stepGrade.subjectId],
		references: [subject.id]
	}),
}));

export const amsStepResultRelations = relations(stepResult, ({one, many}) => ({
	amsStepGrades: many(stepGrade),
	certCategory: one(certCategory, {
		fields: [stepResult.certCategoryId],
		references: [certCategory.id]
	}),
}));

export const amsSubjectRelations = relations(subject, ({many}) => ({
	amsStepGrades: many(stepGrade),
}));

export const amsStepGuardianRelations = relations(stepGuardian, ({one}) => ({
	relation: one(relation, {
		fields: [stepGuardian.relationId],
		references: [relation.id]
	}),
	title: one(title, {
		fields: [stepGuardian.titleId],
		references: [title.id]
	}),
}));

export const relationRelations = relations(relation, ({many}) => ({
	amsStepGuardians: many(stepGuardian),
	hrsRelatives: many(relative),
}));

export const amsStepRefereeRelations = relations(stepReferee, ({one}) => ({
	title: one(title, {
		fields: [stepReferee.titleId],
		references: [title.id]
	}),
}));

export const amsVoucherRelations = relations(voucher, ({one}) => ({
	admission: one(admission, {
		fields: [voucher.admissionId],
		references: [admission.id]
	}),
	category: one(category, {
		fields: [voucher.categoryId],
		references: [category.id]
	}),
	vendor: one(vendor, {
		fields: [voucher.vendorId],
		references: [vendor.id]
	}),
}));

export const amsVendorRelations = relations(vendor, ({many}) => ({
	amsVouchers: many(voucher),
}));

export const evaluationRelations = relations(evaluation, ({one, many}) => ({
	course: one(course, {
		fields: [evaluation.courseId],
		references: [course.id]
	}),
	student: one(student, {
		fields: [evaluation.indexno],
		references: [student.indexno]
	}),
	session: one(session, {
		fields: [evaluation.sessionId],
		references: [session.id]
	}),
	staff: one(staff, {
		fields: [evaluation.staffNo],
		references: [staff.staffNo]
	}),
	evaluationResponses: many(evaluationResponse),
}));

export const evaluationResponseRelations = relations(evaluationResponse, ({one}) => ({
	evaluation: one(evaluation, {
		fields: [evaluationResponse.evaluationId],
		references: [evaluation.id]
	}),
	evaluationOption: one(evaluationOption, {
		fields: [evaluationResponse.optionId],
		references: [evaluationOption.id]
	}),
	evaluationQuestion: one(evaluationQuestion, {
		fields: [evaluationResponse.questionId],
		references: [evaluationQuestion.id]
	}),
}));

export const evaluationOptionRelations = relations(evaluationOption, ({many}) => ({
	evaluationResponses: many(evaluationResponse),
}));

export const evaluationQuestionRelations = relations(evaluationQuestion, ({many}) => ({
	evaluationResponses: many(evaluationResponse),
}));

export const evsAttackRelations = relations(attack, ({one}) => ({
	election: one(election, {
		fields: [attack.electionId],
		references: [election.id]
	}),
}));

export const evsElectionRelations = relations(election, ({one, many}) => ({
	evsAttacks: many(attack),
	group: one(group, {
		fields: [election.groupId],
		references: [group.id]
	}),
	evsElectors: many(elector),
	evsPortfolios: many(portfolio),
}));

export const evsCandidateRelations = relations(candidate, ({one}) => ({
	portfolio: one(portfolio, {
		fields: [candidate.portfolioId],
		references: [portfolio.id]
	}),
}));

export const evsPortfolioRelations = relations(portfolio, ({one, many}) => ({
	candidate: many(candidate),
	election: one(election, {
		fields: [portfolio.electionId],
		references: [election.id]
	}),
}));

export const ssoGroupRelations = relations(group, ({many}) => ({
	evsElections: many(election),
	ssoUsers: many(user),
}));

export const evsElectorRelations = relations(elector, ({one}) => ({
	election: one(election, {
		fields: [elector.electionId],
		references: [election.id]
	}),
}));

export const fmsActivityBillRelations = relations(activityBill, ({one}) => ({
	bill: one(bill, {
		fields: [activityBill.billId],
		references: [bill.id]
	}),
	user: one(user, {
		fields: [activityBill.userId],
		references: [user.id]
	}),
}));

export const ssoUserRelations = relations(user, ({one, many}) => ({
	fmsActivityBills: many(activityBill),
	ssoProviders: many(provider),
	ssoUroles: many(userRole),
	group: one(group, {
		fields: [user.groupId],
		references: [group.id]
	}),
}));

export const fmsActivityVoucherRelations = relations(activityFinanceVoucher, ({one}) => ({
	admission: one(admission, {
		fields: [activityFinanceVoucher.admissionId],
		references: [admission.id]
	}),
	transaction: one(transaction, {
		fields: [activityFinanceVoucher.transactId],
		references: [transaction.id]
	}),
}));

export const fmsBankaccRelations = relations(bankacc, ({one, many}) => ({
	unit: one(unit, {
		fields: [bankacc.unitId],
		references: [unit.id]
	}),
	fmsBills: many(bill),
	fmsTransactions: many(transaction),
	fmsTranstypes: many(transtype),
}));

export const fmsChargeRelations = relations(charge, ({one, many}) => ({
	student: one(student, {
		fields: [charge.studentId],
		references: [student.id]
	}),
	fmsStudaccounts: many(studentAccount),
}));

export const fmsStudaccountRelations = relations(studentAccount, ({one}) => ({
	bill: one(bill, {
		fields: [studentAccount.billId],
		references: [bill.id]
	}),
	charge: one(charge, {
		fields: [studentAccount.chargeId],
		references: [charge.id]
	}),
	session: one(session, {
		fields: [studentAccount.sessionId],
		references: [session.id]
	}),
	student: one(student, {
		fields: [studentAccount.studentId],
		references: [student.id]
	}),
	transaction: one(transaction, {
		fields: [studentAccount.transactId],
		references: [transaction.id]
	}),
}));

export const fmsCollectorRelations = relations(collector, ({many}) => ({
	fmsTransactions: many(transaction),
}));

export const fmsTranstypeRelations = relations(transtype, ({one, many}) => ({
	fmsTransactions: many(transaction),
	bankacc: one(bankacc, {
		fields: [transtype.bankaccId],
		references: [bankacc.id]
	}),
}));

export const hrsCircularRelations = relations(circular, ({one}) => ({
	upload: one(upload, {
		fields: [circular.uploadId],
		references: [upload.id]
	}),
}));

export const hrsUploadRelations = relations(upload, ({many}) => ({
	hrsCirculars: many(circular),
	hrsOptions: many(option),
	hrsResponses: many(response),
}));

export const hrsFormRelations = relations(form, ({one, many}) => ({
	formType: one(formType, {
		fields: [form.typeId],
		references: [formType.id]
	}),
	hrsQuestions: many(question),
}));

export const hrsFormTypeRelations = relations(formType, ({many}) => ({
	hrsForms: many(form),
}));

export const hrsLeaveRelations = relations(leave, ({one}) => ({
	hrsStaff_approverId: one(staff, {
		fields: [leave.approverId],
		references: [staff.staffNo],
		relationName: "hrsLeave_approverId_hrsStaff_staffNo"
	}),
	leaveCategory: one(leaveCategory, {
		fields: [leave.leaveCategoryId],
		references: [leaveCategory.id]
	}),
	hrsStaff_relieverId: one(staff, {
		fields: [leave.relieverId],
		references: [staff.staffNo],
		relationName: "hrsLeave_relieverId_hrsStaff_staffNo"
	}),
	hrsStaff_staffId: one(staff, {
		fields: [leave.staffId],
		references: [staff.staffNo],
		relationName: "hrsLeave_staffId_hrsStaff_staffNo"
	}),
	hrsStaff_supervisorId: one(staff, {
		fields: [leave.supervisorId],
		references: [staff.staffNo],
		relationName: "hrsLeave_supervisorId_hrsStaff_staffNo"
	}),
}));

export const hrsLeaveCategoryRelations = relations(leaveCategory, ({many}) => ({
	hrsLeaves: many(leave),
	hrsLeaveWeights: many(leaveWeight),
}));

export const hrsLeaveApproverRelations = relations(leaveApprover, ({one}) => ({
	staff: one(staff, {
		fields: [leaveApprover.approverId],
		references: [staff.staffNo]
	}),
}));

export const hrsLeaveBalanceRelations = relations(leaveBalance, ({one}) => ({
	staff: one(staff, {
		fields: [leaveBalance.staffId],
		references: [staff.staffNo]
	}),
}));

export const hrsLeaveDeferRelations = relations(leaveDefer, ({one}) => ({
	hrsStaff_approverId: one(staff, {
		fields: [leaveDefer.approverId],
		references: [staff.staffNo],
		relationName: "hrsLeaveDefer_approverId_hrsStaff_staffNo"
	}),
	hrsStaff_staffId: one(staff, {
		fields: [leaveDefer.staffId],
		references: [staff.staffNo],
		relationName: "hrsLeaveDefer_staffId_hrsStaff_staffNo"
	}),
	hrsStaff_supervisorId: one(staff, {
		fields: [leaveDefer.supervisorId],
		references: [staff.staffNo],
		relationName: "hrsLeaveDefer_supervisorId_hrsStaff_staffNo"
	}),
}));

export const hrsLeaveWeightRelations = relations(leaveWeight, ({one}) => ({
	leaveCategory: one(leaveCategory, {
		fields: [leaveWeight.leaveCategoryId],
		references: [leaveCategory.id]
	}),
}));

export const hrsNssRelations = relations(nss, ({one}) => ({
	country: one(country, {
		fields: [nss.countryId],
		references: [country.id]
	}),
	marital: one(marital, {
		fields: [nss.maritalId],
		references: [marital.id]
	}),
	region: one(region, {
		fields: [nss.regionId],
		references: [region.id]
	}),
	religion: one(religion, {
		fields: [nss.religionId],
		references: [religion.id]
	}),
	title: one(title, {
		fields: [nss.titleId],
		references: [title.id]
	}),
	unit: one(unit, {
		fields: [nss.unitId],
		references: [unit.id]
	}),
}));

export const hrsOptionRelations = relations(option, ({one}) => ({
	upload: one(upload, {
		fields: [option.atttachId],
		references: [upload.id]
	}),
	question: one(question, {
		fields: [option.questionId],
		references: [question.id]
	}),
}));

export const hrsQuestionRelations = relations(question, ({one, many}) => ({
	hrsOptions: many(option),
	form: one(form, {
		fields: [question.formId],
		references: [form.id]
	}),
	section: one(section, {
		fields: [question.sectionId],
		references: [section.id]
	}),
	hrsResponses: many(response),
}));

export const hrsPositionRelations = relations(position, ({one, many}) => ({
	positionInfo: one(positionInfo, {
		fields: [position.positionInfoId],
		references: [positionInfo.id]
	}),
	scale: one(scale, {
		fields: [position.scaleId],
		references: [scale.id]
	}),
	staff: one(staff, {
		fields: [position.staffNo],
		references: [staff.staffNo],
		relationName: "hrsPosition_staffNo_hrsStaff_staffNo"
	}),
	hrsStaffs: many(staff, {
		relationName: "hrsStaff_positionId_hrsPosition_id"
	}),
}));

export const hrsPositionInfoRelations = relations(positionInfo, ({one, many}) => ({
	hrsPositions: many(position),
	unit: one(unit, {
		fields: [positionInfo.unitId],
		references: [unit.id]
	}),
}));

export const hrsScaleRelations = relations(scale, ({many}) => ({
	hrsPositions: many(position),
	hrsPromotions: many(promotion),
}));

export const hrsPromotionRelations = relations(promotion, ({one, many}) => ({
	job: one(job, {
		fields: [promotion.jobId],
		references: [job.id]
	}),
	scale: one(scale, {
		fields: [promotion.scaleId],
		references: [scale.id]
	}),
	staff: one(staff, {
		fields: [promotion.staffNo],
		references: [staff.staffNo],
		relationName: "hrsPromotion_staffNo_hrsStaff_staffNo"
	}),
	hrsStaffs_firstOfferId: many(staff, {
		relationName: "hrsStaff_firstOfferId_hrsPromotion_id"
	}),
	hrsStaffs_promotionId: many(staff, {
		relationName: "hrsStaff_promotionId_hrsPromotion_id"
	}),
}));

export const hrsJobRelations = relations(job, ({many}) => ({
	hrsPromotions: many(promotion),
	hrsStaffs: many(staff),
}));

export const hrsSectionRelations = relations(section, ({many}) => ({
	hrsQuestions: many(question),
}));

export const hrsRelativeRelations = relations(relative, ({one}) => ({
	relation: one(relation, {
		fields: [relative.relationId],
		references: [relation.id]
	}),
	staff: one(staff, {
		fields: [relative.staffId],
		references: [staff.staffNo]
	}),
	title: one(title, {
		fields: [relative.titleId],
		references: [title.id]
	}),
}));

export const hrsRespondentRelations = relations(respondent, ({one, many}) => ({
	hrsStaff_staffId: one(staff, {
		fields: [respondent.staffId],
		references: [staff.staffNo],
		relationName: "hrsRespondent_staffId_hrsStaff_staffNo"
	}),
	hrsStaff_supervisorId: one(staff, {
		fields: [respondent.supervisorId],
		references: [staff.staffNo],
		relationName: "hrsRespondent_supervisorId_hrsStaff_staffNo"
	}),
	hrsResponses: many(response),
}));

export const hrsResponseRelations = relations(response, ({one}) => ({
	upload: one(upload, {
		fields: [response.attachId],
		references: [upload.id]
	}),
	question: one(question, {
		fields: [response.questionId],
		references: [question.id]
	}),
	respondent: one(respondent, {
		fields: [response.respondentId],
		references: [respondent.id]
	}),
}));

export const hrsTransferRelations = relations(transfer, ({one}) => ({
	hrsStaff_approverId: one(staff, {
		fields: [transfer.approverId],
		references: [staff.staffNo],
		relationName: "hrsTransfer_approverId_hrsStaff_staffNo"
	}),
	hrsStaff_creatorId: one(staff, {
		fields: [transfer.creatorId],
		references: [staff.staffNo],
		relationName: "hrsTransfer_creatorId_hrsStaff_staffNo"
	}),
	unit_fromUnitId: one(unit, {
		fields: [transfer.fromUnitId],
		references: [unit.id],
		relationName: "hrsTransfer_fromUnitId_unit_id"
	}),
	hrsStaff_staffId: one(staff, {
		fields: [transfer.staffId],
		references: [staff.staffNo],
		relationName: "hrsTransfer_staffId_hrsStaff_staffNo"
	}),
	unit_toUnitId: one(unit, {
		fields: [transfer.toUnitId],
		references: [unit.id],
		relationName: "hrsTransfer_toUnitId_unit_id"
	}),
}));

export const ssoAroleRelations = relations(appRole, ({one, many}) => ({
	app: one(app, {
		fields: [appRole.appId],
		references: [app.id]
	}),
	ssoUroles: many(userRole),
}));

export const ssoUroleRelations = relations(userRole, ({one}) => ({
	appRole: one(appRole, {
		fields: [userRole.appRoleId],
		references: [appRole.id]
	}),
	user: one(user, {
		fields: [userRole.userId],
		references: [user.id]
	}),
}));