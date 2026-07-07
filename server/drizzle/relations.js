"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.amsStepDocumentRelations = exports.amsSortedRelations = exports.amsPriceRelations = exports.amsGradeWeightRelations = exports.fmsBillRelations = exports.amsFresherRelations = exports.amsCategoryRelations = exports.amsFormRelations = exports.amsInstituteCategoryRelations = exports.amsCertCategoryRelations = exports.amsStageRelations = exports.amsStepProfileRelations = exports.amsStepChoiceRelations = exports.amsApplytypeRelations = exports.amsApplicantRelations = exports.amsLetterRelations = exports.amsAdmissionRelations = exports.fmsTransactionRelations = exports.aisTranswiftRelations = exports.titleRelations = exports.religionRelations = exports.regionRelations = exports.maritalRelations = exports.disabilityRelations = exports.countryRelations = exports.aisStructureRelations = exports.aisStructmetaRelations = exports.aisSheetRelations = exports.aisResitSessionRelations = exports.aisResitRelations = exports.unitRelations = exports.modeRelations = exports.aisMajorRelations = exports.aisGraduateSessionRelations = exports.aisGraduateRelations = exports.aisCourseRelations = exports.aisAssessmentRelations = exports.aisActivityRegisterRelations = exports.aisActivityProgressRelations = exports.aisProgramRelations = exports.aisActivityProgchangeRelations = exports.aisStudentRelations = exports.aisActivityDeferRelations = exports.aisSessionRelations = exports.aisSchemeRelations = exports.hrsStaffRelations = exports.aisActivityBacklogRelations = exports.ssoProviderRelations = exports.ssoAppRelations = exports.appToproviderRelations = void 0;
exports.hrsResponseRelations = exports.hrsRespondentRelations = exports.hrsRelativeRelations = exports.hrsSectionRelations = exports.hrsJobRelations = exports.hrsPromotionRelations = exports.hrsScaleRelations = exports.hrsPositionInfoRelations = exports.hrsPositionRelations = exports.hrsQuestionRelations = exports.hrsOptionRelations = exports.hrsNssRelations = exports.hrsLeaveWeightRelations = exports.hrsLeaveDeferRelations = exports.hrsLeaveBalanceRelations = exports.hrsLeaveApproverRelations = exports.hrsLeaveCategoryRelations = exports.hrsLeaveRelations = exports.hrsFormTypeRelations = exports.hrsFormRelations = exports.hrsUploadRelations = exports.hrsCircularRelations = exports.fmsTranstypeRelations = exports.fmsCollectorRelations = exports.fmsStudaccountRelations = exports.fmsChargeRelations = exports.fmsBankaccRelations = exports.fmsActivityVoucherRelations = exports.ssoUserRelations = exports.fmsActivityBillRelations = exports.evsElectorRelations = exports.ssoGroupRelations = exports.evsPortfolioRelations = exports.evsCandidateRelations = exports.evsElectionRelations = exports.evsAttackRelations = exports.evaluationQuestionRelations = exports.evaluationOptionRelations = exports.evaluationResponseRelations = exports.evaluationRelations = exports.amsVendorRelations = exports.amsVoucherRelations = exports.amsStepRefereeRelations = exports.relationRelations = exports.amsStepGuardianRelations = exports.amsSubjectRelations = exports.amsStepResultRelations = exports.amsStepGradeRelations = exports.amsStepEducationRelations = exports.amsDocumentCategoryRelations = void 0;
exports.ssoUroleRelations = exports.ssoAroleRelations = exports.hrsTransferRelations = void 0;
const relations_1 = require("drizzle-orm/relations");
const schema_1 = require("./schema");
exports.appToproviderRelations = (0, relations_1.relations)(schema_1.appToprovider, ({ one }) => ({
    app: one(schema_1.app, {
        fields: [schema_1.appToprovider.a],
        references: [schema_1.app.id]
    }),
    provider: one(schema_1.provider, {
        fields: [schema_1.appToprovider.b],
        references: [schema_1.provider.providerId]
    }),
}));
exports.ssoAppRelations = (0, relations_1.relations)(schema_1.app, ({ many }) => ({
    appToproviders: many(schema_1.appToprovider),
    ssoAroles: many(schema_1.appRole),
}));
exports.ssoProviderRelations = (0, relations_1.relations)(schema_1.provider, ({ one, many }) => ({
    appToproviders: many(schema_1.appToprovider),
    user: one(schema_1.user, {
        fields: [schema_1.provider.userId],
        references: [schema_1.user.id]
    }),
}));
exports.aisActivityBacklogRelations = (0, relations_1.relations)(schema_1.activityBacklog, ({ one }) => ({
    hrsStaff_approvedBy: one(schema_1.staff, {
        fields: [schema_1.activityBacklog.approvedBy],
        references: [schema_1.staff.staffNo],
        relationName: "aisActivityBacklog_approvedBy_hrsStaff_staffNo"
    }),
    hrsStaff_createdBy: one(schema_1.staff, {
        fields: [schema_1.activityBacklog.createdBy],
        references: [schema_1.staff.staffNo],
        relationName: "aisActivityBacklog_createdBy_hrsStaff_staffNo"
    }),
    scheme: one(schema_1.scheme, {
        fields: [schema_1.activityBacklog.schemeId],
        references: [schema_1.scheme.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.activityBacklog.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.hrsStaffRelations = (0, relations_1.relations)(schema_1.staff, ({ one, many }) => ({
    aisActivityBacklogs_approvedBy: many(schema_1.activityBacklog, {
        relationName: "aisActivityBacklog_approvedBy_hrsStaff_staffNo"
    }),
    aisActivityBacklogs_createdBy: many(schema_1.activityBacklog, {
        relationName: "aisActivityBacklog_createdBy_hrsStaff_staffNo"
    }),
    aisSheets_assessorId: many(schema_1.sheet, {
        relationName: "aisSheet_assessorId_hrsStaff_staffNo"
    }),
    aisSheets_assignStaffId: many(schema_1.sheet, {
        relationName: "aisSheet_assignStaffId_hrsStaff_staffNo"
    }),
    aisSheets_certifierId: many(schema_1.sheet, {
        relationName: "aisSheet_certifierId_hrsStaff_staffNo"
    }),
    aisTranswifts: many(schema_1.transwift),
    evaluations: many(schema_1.evaluation),
    hrsLeaves_approverId: many(schema_1.leave, {
        relationName: "hrsLeave_approverId_hrsStaff_staffNo"
    }),
    hrsLeaves_relieverId: many(schema_1.leave, {
        relationName: "hrsLeave_relieverId_hrsStaff_staffNo"
    }),
    hrsLeaves_staffId: many(schema_1.leave, {
        relationName: "hrsLeave_staffId_hrsStaff_staffNo"
    }),
    hrsLeaves_supervisorId: many(schema_1.leave, {
        relationName: "hrsLeave_supervisorId_hrsStaff_staffNo"
    }),
    hrsLeaveApprovers: many(schema_1.leaveApprover),
    hrsLeaveBalances: many(schema_1.leaveBalance),
    hrsLeaveDefers_approverId: many(schema_1.leaveDefer, {
        relationName: "hrsLeaveDefer_approverId_hrsStaff_staffNo"
    }),
    hrsLeaveDefers_staffId: many(schema_1.leaveDefer, {
        relationName: "hrsLeaveDefer_staffId_hrsStaff_staffNo"
    }),
    hrsLeaveDefers_supervisorId: many(schema_1.leaveDefer, {
        relationName: "hrsLeaveDefer_supervisorId_hrsStaff_staffNo"
    }),
    hrsPositions: many(schema_1.position, {
        relationName: "hrsPosition_staffNo_hrsStaff_staffNo"
    }),
    hrsPromotions: many(schema_1.promotion, {
        relationName: "hrsPromotion_staffNo_hrsStaff_staffNo"
    }),
    hrsRelatives: many(schema_1.relative),
    hrsRespondents_staffId: many(schema_1.respondent, {
        relationName: "hrsRespondent_staffId_hrsStaff_staffNo"
    }),
    hrsRespondents_supervisorId: many(schema_1.respondent, {
        relationName: "hrsRespondent_supervisorId_hrsStaff_staffNo"
    }),
    country: one(schema_1.country, {
        fields: [schema_1.staff.countryId],
        references: [schema_1.country.id]
    }),
    hrsPromotion_firstOfferId: one(schema_1.promotion, {
        fields: [schema_1.staff.firstOfferId],
        references: [schema_1.promotion.id],
        relationName: "hrsStaff_firstOfferId_hrsPromotion_id"
    }),
    job: one(schema_1.job, {
        fields: [schema_1.staff.jobId],
        references: [schema_1.job.id]
    }),
    marital: one(schema_1.marital, {
        fields: [schema_1.staff.maritalId],
        references: [schema_1.marital.id]
    }),
    position: one(schema_1.position, {
        fields: [schema_1.staff.positionId],
        references: [schema_1.position.id],
        relationName: "hrsStaff_positionId_hrsPosition_id"
    }),
    hrsPromotion_promotionId: one(schema_1.promotion, {
        fields: [schema_1.staff.promotionId],
        references: [schema_1.promotion.id],
        relationName: "hrsStaff_promotionId_hrsPromotion_id"
    }),
    region: one(schema_1.region, {
        fields: [schema_1.staff.regionId],
        references: [schema_1.region.id]
    }),
    religion: one(schema_1.religion, {
        fields: [schema_1.staff.religionId],
        references: [schema_1.religion.id]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.staff.titleId],
        references: [schema_1.title.id]
    }),
    unit: one(schema_1.unit, {
        fields: [schema_1.staff.unitId],
        references: [schema_1.unit.id]
    }),
    hrsTransfers_approverId: many(schema_1.transfer, {
        relationName: "hrsTransfer_approverId_hrsStaff_staffNo"
    }),
    hrsTransfers_creatorId: many(schema_1.transfer, {
        relationName: "hrsTransfer_creatorId_hrsStaff_staffNo"
    }),
    hrsTransfers_staffId: many(schema_1.transfer, {
        relationName: "hrsTransfer_staffId_hrsStaff_staffNo"
    }),
}));
exports.aisSchemeRelations = (0, relations_1.relations)(schema_1.scheme, ({ many }) => ({
    aisActivityBacklogs: many(schema_1.activityBacklog),
    aisAssessments: many(schema_1.assessment),
    aisPrograms: many(schema_1.program),
    aisResits: many(schema_1.resit),
}));
exports.aisSessionRelations = (0, relations_1.relations)(schema_1.session, ({ many }) => ({
    aisActivityBacklogs: many(schema_1.activityBacklog),
    aisActivityDefers: many(schema_1.activityDefer),
    aisActivityProgchanges: many(schema_1.activityProgchange),
    aisActivityProgresses: many(schema_1.activityProgress),
    aisActivityRegisters: many(schema_1.activityRegister),
    aisAssessments: many(schema_1.assessment),
    aisResits_registerSessionId: many(schema_1.resit, {
        relationName: "aisResit_registerSessionId_aisSession_id"
    }),
    aisResits_trailSessionId: many(schema_1.resit, {
        relationName: "aisResit_trailSessionId_aisSession_id"
    }),
    aisSheets: many(schema_1.sheet),
    amsAdmissions: many(schema_1.admission),
    amsFreshers: many(schema_1.fresher),
    evaluations: many(schema_1.evaluation),
    fmsBills: many(schema_1.bill),
    fmsStudaccounts: many(schema_1.studentAccount),
}));
exports.aisActivityDeferRelations = (0, relations_1.relations)(schema_1.activityDefer, ({ one }) => ({
    student: one(schema_1.student, {
        fields: [schema_1.activityDefer.indexno],
        references: [schema_1.student.indexno]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.activityDefer.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.aisStudentRelations = (0, relations_1.relations)(schema_1.student, ({ one, many }) => ({
    aisActivityDefers: many(schema_1.activityDefer),
    aisActivityProgchanges: many(schema_1.activityProgchange),
    aisActivityProgresses: many(schema_1.activityProgress),
    aisActivityRegisters: many(schema_1.activityRegister),
    aisAssessments: many(schema_1.assessment),
    aisGraduates: many(schema_1.graduate),
    aisResits: many(schema_1.resit),
    country_countryId: one(schema_1.country, {
        fields: [schema_1.student.countryId],
        references: [schema_1.country.id],
        relationName: "aisStudent_countryId_country_id"
    }),
    disability: one(schema_1.disability, {
        fields: [schema_1.student.disabilityId],
        references: [schema_1.disability.id]
    }),
    major: one(schema_1.major, {
        fields: [schema_1.student.majorId],
        references: [schema_1.major.id]
    }),
    marital: one(schema_1.marital, {
        fields: [schema_1.student.maritalId],
        references: [schema_1.marital.id]
    }),
    country_nationalityId: one(schema_1.country, {
        fields: [schema_1.student.nationalityId],
        references: [schema_1.country.id],
        relationName: "aisStudent_nationalityId_country_id"
    }),
    program: one(schema_1.program, {
        fields: [schema_1.student.programId],
        references: [schema_1.program.id]
    }),
    region: one(schema_1.region, {
        fields: [schema_1.student.regionId],
        references: [schema_1.region.id]
    }),
    religion: one(schema_1.religion, {
        fields: [schema_1.student.religionId],
        references: [schema_1.religion.id]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.student.titleId],
        references: [schema_1.title.id]
    }),
    aisTranswifts: many(schema_1.transwift),
    amsFreshers: many(schema_1.fresher),
    evaluations: many(schema_1.evaluation),
    fmsCharges: many(schema_1.charge),
    fmsStudaccounts: many(schema_1.studentAccount),
    fmsTransactions: many(schema_1.transaction),
}));
exports.aisActivityProgchangeRelations = (0, relations_1.relations)(schema_1.activityProgchange, ({ one }) => ({
    aisProgram_newProgramId: one(schema_1.program, {
        fields: [schema_1.activityProgchange.newProgramId],
        references: [schema_1.program.id],
        relationName: "aisActivityProgchange_newProgramId_aisProgram_id"
    }),
    aisProgram_oldProgramId: one(schema_1.program, {
        fields: [schema_1.activityProgchange.oldProgramId],
        references: [schema_1.program.id],
        relationName: "aisActivityProgchange_oldProgramId_aisProgram_id"
    }),
    session: one(schema_1.session, {
        fields: [schema_1.activityProgchange.sessionId],
        references: [schema_1.session.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.activityProgchange.studentId],
        references: [schema_1.student.id]
    }),
}));
exports.aisProgramRelations = (0, relations_1.relations)(schema_1.program, ({ one, many }) => ({
    aisActivityProgchanges_newProgramId: many(schema_1.activityProgchange, {
        relationName: "aisActivityProgchange_newProgramId_aisProgram_id"
    }),
    aisActivityProgchanges_oldProgramId: many(schema_1.activityProgchange, {
        relationName: "aisActivityProgchange_oldProgramId_aisProgram_id"
    }),
    aisMajors: many(schema_1.major),
    mode: one(schema_1.mode, {
        fields: [schema_1.program.modeId],
        references: [schema_1.mode.id]
    }),
    scheme: one(schema_1.scheme, {
        fields: [schema_1.program.schemeId],
        references: [schema_1.scheme.id]
    }),
    unit: one(schema_1.unit, {
        fields: [schema_1.program.unitId],
        references: [schema_1.unit.id]
    }),
    aisSheets: many(schema_1.sheet),
    aisStructmetas: many(schema_1.structmeta),
    aisStructures: many(schema_1.structure),
    aisStudents: many(schema_1.student),
    amsFreshers: many(schema_1.fresher),
    amsStepChoices: many(schema_1.stepChoice),
    fmsBills: many(schema_1.bill),
}));
exports.aisActivityProgressRelations = (0, relations_1.relations)(schema_1.activityProgress, ({ one }) => ({
    student: one(schema_1.student, {
        fields: [schema_1.activityProgress.indexno],
        references: [schema_1.student.indexno]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.activityProgress.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.aisActivityRegisterRelations = (0, relations_1.relations)(schema_1.activityRegister, ({ one }) => ({
    student: one(schema_1.student, {
        fields: [schema_1.activityRegister.indexno],
        references: [schema_1.student.indexno]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.activityRegister.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.aisAssessmentRelations = (0, relations_1.relations)(schema_1.assessment, ({ one }) => ({
    course: one(schema_1.course, {
        fields: [schema_1.assessment.courseId],
        references: [schema_1.course.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.assessment.indexno],
        references: [schema_1.student.indexno]
    }),
    scheme: one(schema_1.scheme, {
        fields: [schema_1.assessment.schemeId],
        references: [schema_1.scheme.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.assessment.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.aisCourseRelations = (0, relations_1.relations)(schema_1.course, ({ many }) => ({
    aisAssessments: many(schema_1.assessment),
    aisResits: many(schema_1.resit),
    aisSheets: many(schema_1.sheet),
    aisStructures: many(schema_1.structure),
    evaluations: many(schema_1.evaluation),
}));
exports.aisGraduateRelations = (0, relations_1.relations)(schema_1.graduate, ({ one }) => ({
    student: one(schema_1.student, {
        fields: [schema_1.graduate.indexno],
        references: [schema_1.student.indexno]
    }),
    graduateSession: one(schema_1.graduateSession, {
        fields: [schema_1.graduate.sessionId],
        references: [schema_1.graduateSession.id]
    }),
}));
exports.aisGraduateSessionRelations = (0, relations_1.relations)(schema_1.graduateSession, ({ many }) => ({
    aisGraduates: many(schema_1.graduate),
}));
exports.aisMajorRelations = (0, relations_1.relations)(schema_1.major, ({ one, many }) => ({
    program: one(schema_1.program, {
        fields: [schema_1.major.programId],
        references: [schema_1.program.id]
    }),
    aisSheets: many(schema_1.sheet),
    aisStructmetas: many(schema_1.structmeta),
    aisStructures: many(schema_1.structure),
    aisStudents: many(schema_1.student),
    amsFreshers: many(schema_1.fresher),
    amsStepChoices: many(schema_1.stepChoice),
}));
exports.modeRelations = (0, relations_1.relations)(schema_1.mode, ({ many }) => ({
    aisPrograms: many(schema_1.program),
}));
exports.unitRelations = (0, relations_1.relations)(schema_1.unit, ({ one, many }) => ({
    aisPrograms: many(schema_1.program),
    aisSheets: many(schema_1.sheet),
    aisStructures: many(schema_1.structure),
    fmsBankaccs: many(schema_1.bankacc),
    hrsNsses: many(schema_1.nss),
    hrsPositionInfos: many(schema_1.positionInfo),
    hrsStaffs: many(schema_1.staff),
    hrsTransfers_fromUnitId: many(schema_1.transfer, {
        relationName: "hrsTransfer_fromUnitId_unit_id"
    }),
    hrsTransfers_toUnitId: many(schema_1.transfer, {
        relationName: "hrsTransfer_toUnitId_unit_id"
    }),
    unit_level1Id: one(schema_1.unit, {
        fields: [schema_1.unit.level1Id],
        references: [schema_1.unit.id],
        relationName: "unit_level1Id_unit_id"
    }),
    units_level1Id: many(schema_1.unit, {
        relationName: "unit_level1Id_unit_id"
    }),
    unit_level2Id: one(schema_1.unit, {
        fields: [schema_1.unit.level2Id],
        references: [schema_1.unit.id],
        relationName: "unit_level2Id_unit_id"
    }),
    units_level2Id: many(schema_1.unit, {
        relationName: "unit_level2Id_unit_id"
    }),
    unit_level3Id: one(schema_1.unit, {
        fields: [schema_1.unit.level3Id],
        references: [schema_1.unit.id],
        relationName: "unit_level3Id_unit_id"
    }),
    units_level3Id: many(schema_1.unit, {
        relationName: "unit_level3Id_unit_id"
    }),
}));
exports.aisResitRelations = (0, relations_1.relations)(schema_1.resit, ({ one }) => ({
    course: one(schema_1.course, {
        fields: [schema_1.resit.courseId],
        references: [schema_1.course.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.resit.indexno],
        references: [schema_1.student.indexno]
    }),
    aisSession_registerSessionId: one(schema_1.session, {
        fields: [schema_1.resit.registerSessionId],
        references: [schema_1.session.id],
        relationName: "aisResit_registerSessionId_aisSession_id"
    }),
    scheme: one(schema_1.scheme, {
        fields: [schema_1.resit.schemeId],
        references: [schema_1.scheme.id]
    }),
    resitSession: one(schema_1.resitSession, {
        fields: [schema_1.resit.sessionId],
        references: [schema_1.resitSession.id]
    }),
    aisSession_trailSessionId: one(schema_1.session, {
        fields: [schema_1.resit.trailSessionId],
        references: [schema_1.session.id],
        relationName: "aisResit_trailSessionId_aisSession_id"
    }),
}));
exports.aisResitSessionRelations = (0, relations_1.relations)(schema_1.resitSession, ({ many }) => ({
    aisResits: many(schema_1.resit),
}));
exports.aisSheetRelations = (0, relations_1.relations)(schema_1.sheet, ({ one }) => ({
    hrsStaff_assessorId: one(schema_1.staff, {
        fields: [schema_1.sheet.assessorId],
        references: [schema_1.staff.staffNo],
        relationName: "aisSheet_assessorId_hrsStaff_staffNo"
    }),
    hrsStaff_assignStaffId: one(schema_1.staff, {
        fields: [schema_1.sheet.assignStaffId],
        references: [schema_1.staff.staffNo],
        relationName: "aisSheet_assignStaffId_hrsStaff_staffNo"
    }),
    hrsStaff_certifierId: one(schema_1.staff, {
        fields: [schema_1.sheet.certifierId],
        references: [schema_1.staff.staffNo],
        relationName: "aisSheet_certifierId_hrsStaff_staffNo"
    }),
    course: one(schema_1.course, {
        fields: [schema_1.sheet.courseId],
        references: [schema_1.course.id]
    }),
    major: one(schema_1.major, {
        fields: [schema_1.sheet.majorId],
        references: [schema_1.major.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.sheet.programId],
        references: [schema_1.program.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.sheet.sessionId],
        references: [schema_1.session.id]
    }),
    unit: one(schema_1.unit, {
        fields: [schema_1.sheet.unitId],
        references: [schema_1.unit.id]
    }),
}));
exports.aisStructmetaRelations = (0, relations_1.relations)(schema_1.structmeta, ({ one }) => ({
    major: one(schema_1.major, {
        fields: [schema_1.structmeta.majorId],
        references: [schema_1.major.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.structmeta.programId],
        references: [schema_1.program.id]
    }),
}));
exports.aisStructureRelations = (0, relations_1.relations)(schema_1.structure, ({ one }) => ({
    course: one(schema_1.course, {
        fields: [schema_1.structure.courseId],
        references: [schema_1.course.id]
    }),
    major: one(schema_1.major, {
        fields: [schema_1.structure.majorId],
        references: [schema_1.major.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.structure.programId],
        references: [schema_1.program.id]
    }),
    unit: one(schema_1.unit, {
        fields: [schema_1.structure.unitId],
        references: [schema_1.unit.id]
    }),
}));
exports.countryRelations = (0, relations_1.relations)(schema_1.country, ({ many }) => ({
    aisStudents_countryId: many(schema_1.student, {
        relationName: "aisStudent_countryId_country_id"
    }),
    aisStudents_nationalityId: many(schema_1.student, {
        relationName: "aisStudent_nationalityId_country_id"
    }),
    amsStepProfiles_countryId: many(schema_1.stepProfile, {
        relationName: "amsStepProfile_countryId_country_id"
    }),
    amsStepProfiles_nationalityId: many(schema_1.stepProfile, {
        relationName: "amsStepProfile_nationalityId_country_id"
    }),
    hrsNsses: many(schema_1.nss),
    hrsStaffs: many(schema_1.staff),
}));
exports.disabilityRelations = (0, relations_1.relations)(schema_1.disability, ({ many }) => ({
    aisStudents: many(schema_1.student),
    amsStepProfiles: many(schema_1.stepProfile),
}));
exports.maritalRelations = (0, relations_1.relations)(schema_1.marital, ({ many }) => ({
    aisStudents: many(schema_1.student),
    amsStepProfiles: many(schema_1.stepProfile),
    hrsNsses: many(schema_1.nss),
    hrsStaffs: many(schema_1.staff),
}));
exports.regionRelations = (0, relations_1.relations)(schema_1.region, ({ many }) => ({
    aisStudents: many(schema_1.student),
    amsStepProfiles: many(schema_1.stepProfile),
    hrsNsses: many(schema_1.nss),
    hrsStaffs: many(schema_1.staff),
}));
exports.religionRelations = (0, relations_1.relations)(schema_1.religion, ({ many }) => ({
    aisStudents: many(schema_1.student),
    amsStepProfiles: many(schema_1.stepProfile),
    hrsNsses: many(schema_1.nss),
    hrsStaffs: many(schema_1.staff),
}));
exports.titleRelations = (0, relations_1.relations)(schema_1.title, ({ many }) => ({
    aisStudents: many(schema_1.student),
    amsStepGuardians: many(schema_1.stepGuardian),
    amsStepProfiles: many(schema_1.stepProfile),
    amsStepReferees: many(schema_1.stepReferee),
    hrsNsses: many(schema_1.nss),
    hrsRelatives: many(schema_1.relative),
    hrsStaffs: many(schema_1.staff),
}));
exports.aisTranswiftRelations = (0, relations_1.relations)(schema_1.transwift, ({ one }) => ({
    staff: one(schema_1.staff, {
        fields: [schema_1.transwift.issuerId],
        references: [schema_1.staff.staffNo]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.transwift.studentId],
        references: [schema_1.student.id]
    }),
    transaction: one(schema_1.transaction, {
        fields: [schema_1.transwift.transactId],
        references: [schema_1.transaction.id]
    }),
}));
exports.fmsTransactionRelations = (0, relations_1.relations)(schema_1.transaction, ({ one, many }) => ({
    aisTranswifts: many(schema_1.transwift),
    fmsActivityVouchers: many(schema_1.activityFinanceVoucher),
    fmsStudaccounts: many(schema_1.studentAccount),
    bankacc: one(schema_1.bankacc, {
        fields: [schema_1.transaction.bankaccId],
        references: [schema_1.bankacc.id]
    }),
    collector: one(schema_1.collector, {
        fields: [schema_1.transaction.collectorId],
        references: [schema_1.collector.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.transaction.studentId],
        references: [schema_1.student.id]
    }),
    transtype: one(schema_1.transtype, {
        fields: [schema_1.transaction.transtypeId],
        references: [schema_1.transtype.id]
    }),
}));
exports.amsAdmissionRelations = (0, relations_1.relations)(schema_1.admission, ({ one, many }) => ({
    amsLetter_cpletterId: one(schema_1.admissionLetter, {
        fields: [schema_1.admission.cpletterId],
        references: [schema_1.admissionLetter.id],
        relationName: "amsAdmission_cpletterId_amsLetter_id"
    }),
    amsLetter_dpletterId: one(schema_1.admissionLetter, {
        fields: [schema_1.admission.dpletterId],
        references: [schema_1.admissionLetter.id],
        relationName: "amsAdmission_dpletterId_amsLetter_id"
    }),
    amsLetter_pgletterId: one(schema_1.admissionLetter, {
        fields: [schema_1.admission.pgletterId],
        references: [schema_1.admissionLetter.id],
        relationName: "amsAdmission_pgletterId_amsLetter_id"
    }),
    session: one(schema_1.session, {
        fields: [schema_1.admission.sessionId],
        references: [schema_1.session.id]
    }),
    amsLetter_ugletterId: one(schema_1.admissionLetter, {
        fields: [schema_1.admission.ugletterId],
        references: [schema_1.admissionLetter.id],
        relationName: "amsAdmission_ugletterId_amsLetter_id"
    }),
    amsApplicants: many(schema_1.applicant),
    amsFreshers: many(schema_1.fresher),
    amsSorteds: many(schema_1.sorted),
    amsVouchers: many(schema_1.voucher),
    fmsActivityVouchers: many(schema_1.activityFinanceVoucher),
}));
exports.amsLetterRelations = (0, relations_1.relations)(schema_1.admissionLetter, ({ one, many }) => ({
    amsAdmissions_cpletterId: many(schema_1.admission, {
        relationName: "amsAdmission_cpletterId_amsLetter_id"
    }),
    amsAdmissions_dpletterId: many(schema_1.admission, {
        relationName: "amsAdmission_dpletterId_amsLetter_id"
    }),
    amsAdmissions_pgletterId: many(schema_1.admission, {
        relationName: "amsAdmission_pgletterId_amsLetter_id"
    }),
    amsAdmissions_ugletterId: many(schema_1.admission, {
        relationName: "amsAdmission_ugletterId_amsLetter_id"
    }),
    amsFreshers: many(schema_1.fresher),
    category: one(schema_1.category, {
        fields: [schema_1.admissionLetter.categoryId],
        references: [schema_1.category.id]
    }),
}));
exports.amsApplicantRelations = (0, relations_1.relations)(schema_1.applicant, ({ one }) => ({
    admission: one(schema_1.admission, {
        fields: [schema_1.applicant.admissionId],
        references: [schema_1.admission.id]
    }),
    applyType: one(schema_1.applyType, {
        fields: [schema_1.applicant.applyTypeId],
        references: [schema_1.applyType.id]
    }),
    stepChoice: one(schema_1.stepChoice, {
        fields: [schema_1.applicant.choiceId],
        references: [schema_1.stepChoice.id]
    }),
    stepProfile: one(schema_1.stepProfile, {
        fields: [schema_1.applicant.profileId],
        references: [schema_1.stepProfile.serial]
    }),
    stage: one(schema_1.stage, {
        fields: [schema_1.applicant.stageId],
        references: [schema_1.stage.id]
    }),
}));
exports.amsApplytypeRelations = (0, relations_1.relations)(schema_1.applyType, ({ many }) => ({
    amsApplicants: many(schema_1.applicant),
    amsSorteds: many(schema_1.sorted),
}));
exports.amsStepChoiceRelations = (0, relations_1.relations)(schema_1.stepChoice, ({ one, many }) => ({
    amsApplicants: many(schema_1.applicant),
    amsSorteds_choice1Id: many(schema_1.sorted, {
        relationName: "amsSorted_choice1Id_amsStepChoice_id"
    }),
    amsSorteds_choice2Id: many(schema_1.sorted, {
        relationName: "amsSorted_choice2Id_amsStepChoice_id"
    }),
    major: one(schema_1.major, {
        fields: [schema_1.stepChoice.majorId],
        references: [schema_1.major.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.stepChoice.programId],
        references: [schema_1.program.id]
    }),
}));
exports.amsStepProfileRelations = (0, relations_1.relations)(schema_1.stepProfile, ({ one, many }) => ({
    amsApplicants: many(schema_1.applicant),
    amsSorteds: many(schema_1.sorted),
    country_countryId: one(schema_1.country, {
        fields: [schema_1.stepProfile.countryId],
        references: [schema_1.country.id],
        relationName: "amsStepProfile_countryId_country_id"
    }),
    disability: one(schema_1.disability, {
        fields: [schema_1.stepProfile.disabilityId],
        references: [schema_1.disability.id]
    }),
    marital: one(schema_1.marital, {
        fields: [schema_1.stepProfile.maritalId],
        references: [schema_1.marital.id]
    }),
    country_nationalityId: one(schema_1.country, {
        fields: [schema_1.stepProfile.nationalityId],
        references: [schema_1.country.id],
        relationName: "amsStepProfile_nationalityId_country_id"
    }),
    region: one(schema_1.region, {
        fields: [schema_1.stepProfile.regionId],
        references: [schema_1.region.id]
    }),
    religion: one(schema_1.religion, {
        fields: [schema_1.stepProfile.religionId],
        references: [schema_1.religion.id]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.stepProfile.titleId],
        references: [schema_1.title.id]
    }),
}));
exports.amsStageRelations = (0, relations_1.relations)(schema_1.stage, ({ one, many }) => ({
    amsApplicants: many(schema_1.applicant),
    amsSorteds: many(schema_1.sorted),
    category: one(schema_1.category, {
        fields: [schema_1.stage.categoryId],
        references: [schema_1.category.id]
    }),
    amsForm: one(schema_1.amsForm, {
        fields: [schema_1.stage.formId],
        references: [schema_1.amsForm.id]
    }),
}));
exports.amsCertCategoryRelations = (0, relations_1.relations)(schema_1.certCategory, ({ one, many }) => ({
    instituteCategory: one(schema_1.instituteCategory, {
        fields: [schema_1.certCategory.instituteCategoryId],
        references: [schema_1.instituteCategory.id]
    }),
    amsGradeWeights: many(schema_1.gradeWeight),
    amsStepEducations: many(schema_1.stepEducation),
    amsStepResults: many(schema_1.stepResult),
}));
exports.amsInstituteCategoryRelations = (0, relations_1.relations)(schema_1.instituteCategory, ({ many }) => ({
    amsCertCategories: many(schema_1.certCategory),
    amsStepEducations: many(schema_1.stepEducation),
}));
exports.amsFormRelations = (0, relations_1.relations)(schema_1.amsForm, ({ one, many }) => ({
    category: one(schema_1.category, {
        fields: [schema_1.amsForm.categoryId],
        references: [schema_1.category.id]
    }),
    amsStages: many(schema_1.stage),
}));
exports.amsCategoryRelations = (0, relations_1.relations)(schema_1.category, ({ many }) => ({
    amsForms: many(schema_1.amsForm),
    amsFreshers: many(schema_1.fresher),
    amsLetters: many(schema_1.admissionLetter),
    amsPrices: many(schema_1.amsPrice),
    amsSorteds: many(schema_1.sorted),
    amsStages: many(schema_1.stage),
    amsVouchers: many(schema_1.voucher),
}));
exports.amsFresherRelations = (0, relations_1.relations)(schema_1.fresher, ({ one }) => ({
    admission: one(schema_1.admission, {
        fields: [schema_1.fresher.admissionId],
        references: [schema_1.admission.id]
    }),
    bill: one(schema_1.bill, {
        fields: [schema_1.fresher.billId],
        references: [schema_1.bill.id]
    }),
    category: one(schema_1.category, {
        fields: [schema_1.fresher.categoryId],
        references: [schema_1.category.id]
    }),
    admissionLetter: one(schema_1.admissionLetter, {
        fields: [schema_1.fresher.letterId],
        references: [schema_1.admissionLetter.id]
    }),
    major: one(schema_1.major, {
        fields: [schema_1.fresher.majorId],
        references: [schema_1.major.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.fresher.programId],
        references: [schema_1.program.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.fresher.serial],
        references: [schema_1.student.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.fresher.sessionId],
        references: [schema_1.session.id]
    }),
}));
exports.fmsBillRelations = (0, relations_1.relations)(schema_1.bill, ({ one, many }) => ({
    amsFreshers: many(schema_1.fresher),
    fmsActivityBills: many(schema_1.activityBill),
    bankacc: one(schema_1.bankacc, {
        fields: [schema_1.bill.bankaccId],
        references: [schema_1.bankacc.id]
    }),
    program: one(schema_1.program, {
        fields: [schema_1.bill.programId],
        references: [schema_1.program.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.bill.sessionId],
        references: [schema_1.session.id]
    }),
    fmsStudaccounts: many(schema_1.studentAccount),
}));
exports.amsGradeWeightRelations = (0, relations_1.relations)(schema_1.gradeWeight, ({ one, many }) => ({
    certCategory: one(schema_1.certCategory, {
        fields: [schema_1.gradeWeight.certCategoryId],
        references: [schema_1.certCategory.id]
    }),
    amsStepGrades: many(schema_1.stepGrade),
}));
exports.amsPriceRelations = (0, relations_1.relations)(schema_1.amsPrice, ({ one }) => ({
    category: one(schema_1.category, {
        fields: [schema_1.amsPrice.categoryId],
        references: [schema_1.category.id]
    }),
}));
exports.amsSortedRelations = (0, relations_1.relations)(schema_1.sorted, ({ one }) => ({
    admission: one(schema_1.admission, {
        fields: [schema_1.sorted.admissionId],
        references: [schema_1.admission.id]
    }),
    applyType: one(schema_1.applyType, {
        fields: [schema_1.sorted.applyTypeId],
        references: [schema_1.applyType.id]
    }),
    category: one(schema_1.category, {
        fields: [schema_1.sorted.categoryId],
        references: [schema_1.category.id]
    }),
    amsStepChoice_choice1Id: one(schema_1.stepChoice, {
        fields: [schema_1.sorted.choice1Id],
        references: [schema_1.stepChoice.id],
        relationName: "amsSorted_choice1Id_amsStepChoice_id"
    }),
    amsStepChoice_choice2Id: one(schema_1.stepChoice, {
        fields: [schema_1.sorted.choice2Id],
        references: [schema_1.stepChoice.id],
        relationName: "amsSorted_choice2Id_amsStepChoice_id"
    }),
    stepProfile: one(schema_1.stepProfile, {
        fields: [schema_1.sorted.profileId],
        references: [schema_1.stepProfile.serial]
    }),
    stage: one(schema_1.stage, {
        fields: [schema_1.sorted.stageId],
        references: [schema_1.stage.id]
    }),
}));
exports.amsStepDocumentRelations = (0, relations_1.relations)(schema_1.stepDocument, ({ one }) => ({
    documentCategory: one(schema_1.documentCategory, {
        fields: [schema_1.stepDocument.documentCategoryId],
        references: [schema_1.documentCategory.id]
    }),
}));
exports.amsDocumentCategoryRelations = (0, relations_1.relations)(schema_1.documentCategory, ({ many }) => ({
    amsStepDocuments: many(schema_1.stepDocument),
}));
exports.amsStepEducationRelations = (0, relations_1.relations)(schema_1.stepEducation, ({ one }) => ({
    certCategory: one(schema_1.certCategory, {
        fields: [schema_1.stepEducation.certCategoryId],
        references: [schema_1.certCategory.id]
    }),
    instituteCategory: one(schema_1.instituteCategory, {
        fields: [schema_1.stepEducation.instituteCategoryId],
        references: [schema_1.instituteCategory.id]
    }),
}));
exports.amsStepGradeRelations = (0, relations_1.relations)(schema_1.stepGrade, ({ one }) => ({
    gradeWeight: one(schema_1.gradeWeight, {
        fields: [schema_1.stepGrade.gradeWeightId],
        references: [schema_1.gradeWeight.id]
    }),
    stepResult: one(schema_1.stepResult, {
        fields: [schema_1.stepGrade.resultId],
        references: [schema_1.stepResult.id]
    }),
    subject: one(schema_1.subject, {
        fields: [schema_1.stepGrade.subjectId],
        references: [schema_1.subject.id]
    }),
}));
exports.amsStepResultRelations = (0, relations_1.relations)(schema_1.stepResult, ({ one, many }) => ({
    amsStepGrades: many(schema_1.stepGrade),
    certCategory: one(schema_1.certCategory, {
        fields: [schema_1.stepResult.certCategoryId],
        references: [schema_1.certCategory.id]
    }),
}));
exports.amsSubjectRelations = (0, relations_1.relations)(schema_1.subject, ({ many }) => ({
    amsStepGrades: many(schema_1.stepGrade),
}));
exports.amsStepGuardianRelations = (0, relations_1.relations)(schema_1.stepGuardian, ({ one }) => ({
    relation: one(schema_1.relation, {
        fields: [schema_1.stepGuardian.relationId],
        references: [schema_1.relation.id]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.stepGuardian.titleId],
        references: [schema_1.title.id]
    }),
}));
exports.relationRelations = (0, relations_1.relations)(schema_1.relation, ({ many }) => ({
    amsStepGuardians: many(schema_1.stepGuardian),
    hrsRelatives: many(schema_1.relative),
}));
exports.amsStepRefereeRelations = (0, relations_1.relations)(schema_1.stepReferee, ({ one }) => ({
    title: one(schema_1.title, {
        fields: [schema_1.stepReferee.titleId],
        references: [schema_1.title.id]
    }),
}));
exports.amsVoucherRelations = (0, relations_1.relations)(schema_1.voucher, ({ one }) => ({
    admission: one(schema_1.admission, {
        fields: [schema_1.voucher.admissionId],
        references: [schema_1.admission.id]
    }),
    category: one(schema_1.category, {
        fields: [schema_1.voucher.categoryId],
        references: [schema_1.category.id]
    }),
    vendor: one(schema_1.vendor, {
        fields: [schema_1.voucher.vendorId],
        references: [schema_1.vendor.id]
    }),
}));
exports.amsVendorRelations = (0, relations_1.relations)(schema_1.vendor, ({ many }) => ({
    amsVouchers: many(schema_1.voucher),
}));
exports.evaluationRelations = (0, relations_1.relations)(schema_1.evaluation, ({ one, many }) => ({
    course: one(schema_1.course, {
        fields: [schema_1.evaluation.courseId],
        references: [schema_1.course.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.evaluation.indexno],
        references: [schema_1.student.indexno]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.evaluation.sessionId],
        references: [schema_1.session.id]
    }),
    staff: one(schema_1.staff, {
        fields: [schema_1.evaluation.staffNo],
        references: [schema_1.staff.staffNo]
    }),
    evaluationResponses: many(schema_1.evaluationResponse),
}));
exports.evaluationResponseRelations = (0, relations_1.relations)(schema_1.evaluationResponse, ({ one }) => ({
    evaluation: one(schema_1.evaluation, {
        fields: [schema_1.evaluationResponse.evaluationId],
        references: [schema_1.evaluation.id]
    }),
    evaluationOption: one(schema_1.evaluationOption, {
        fields: [schema_1.evaluationResponse.optionId],
        references: [schema_1.evaluationOption.id]
    }),
    evaluationQuestion: one(schema_1.evaluationQuestion, {
        fields: [schema_1.evaluationResponse.questionId],
        references: [schema_1.evaluationQuestion.id]
    }),
}));
exports.evaluationOptionRelations = (0, relations_1.relations)(schema_1.evaluationOption, ({ many }) => ({
    evaluationResponses: many(schema_1.evaluationResponse),
}));
exports.evaluationQuestionRelations = (0, relations_1.relations)(schema_1.evaluationQuestion, ({ many }) => ({
    evaluationResponses: many(schema_1.evaluationResponse),
}));
exports.evsAttackRelations = (0, relations_1.relations)(schema_1.attack, ({ one }) => ({
    election: one(schema_1.election, {
        fields: [schema_1.attack.electionId],
        references: [schema_1.election.id]
    }),
}));
exports.evsElectionRelations = (0, relations_1.relations)(schema_1.election, ({ one, many }) => ({
    evsAttacks: many(schema_1.attack),
    group: one(schema_1.group, {
        fields: [schema_1.election.groupId],
        references: [schema_1.group.id]
    }),
    evsElectors: many(schema_1.elector),
    evsPortfolios: many(schema_1.portfolio),
}));
exports.evsCandidateRelations = (0, relations_1.relations)(schema_1.candidate, ({ one }) => ({
    portfolio: one(schema_1.portfolio, {
        fields: [schema_1.candidate.portfolioId],
        references: [schema_1.portfolio.id]
    }),
}));
exports.evsPortfolioRelations = (0, relations_1.relations)(schema_1.portfolio, ({ one, many }) => ({
    candidate: many(schema_1.candidate),
    election: one(schema_1.election, {
        fields: [schema_1.portfolio.electionId],
        references: [schema_1.election.id]
    }),
}));
exports.ssoGroupRelations = (0, relations_1.relations)(schema_1.group, ({ many }) => ({
    evsElections: many(schema_1.election),
    ssoUsers: many(schema_1.user),
}));
exports.evsElectorRelations = (0, relations_1.relations)(schema_1.elector, ({ one }) => ({
    election: one(schema_1.election, {
        fields: [schema_1.elector.electionId],
        references: [schema_1.election.id]
    }),
}));
exports.fmsActivityBillRelations = (0, relations_1.relations)(schema_1.activityBill, ({ one }) => ({
    bill: one(schema_1.bill, {
        fields: [schema_1.activityBill.billId],
        references: [schema_1.bill.id]
    }),
    user: one(schema_1.user, {
        fields: [schema_1.activityBill.userId],
        references: [schema_1.user.id]
    }),
}));
exports.ssoUserRelations = (0, relations_1.relations)(schema_1.user, ({ one, many }) => ({
    fmsActivityBills: many(schema_1.activityBill),
    ssoProviders: many(schema_1.provider),
    ssoUroles: many(schema_1.userRole),
    group: one(schema_1.group, {
        fields: [schema_1.user.groupId],
        references: [schema_1.group.id]
    }),
}));
exports.fmsActivityVoucherRelations = (0, relations_1.relations)(schema_1.activityFinanceVoucher, ({ one }) => ({
    admission: one(schema_1.admission, {
        fields: [schema_1.activityFinanceVoucher.admissionId],
        references: [schema_1.admission.id]
    }),
    transaction: one(schema_1.transaction, {
        fields: [schema_1.activityFinanceVoucher.transactId],
        references: [schema_1.transaction.id]
    }),
}));
exports.fmsBankaccRelations = (0, relations_1.relations)(schema_1.bankacc, ({ one, many }) => ({
    unit: one(schema_1.unit, {
        fields: [schema_1.bankacc.unitId],
        references: [schema_1.unit.id]
    }),
    fmsBills: many(schema_1.bill),
    fmsTransactions: many(schema_1.transaction),
    fmsTranstypes: many(schema_1.transtype),
}));
exports.fmsChargeRelations = (0, relations_1.relations)(schema_1.charge, ({ one, many }) => ({
    student: one(schema_1.student, {
        fields: [schema_1.charge.studentId],
        references: [schema_1.student.id]
    }),
    fmsStudaccounts: many(schema_1.studentAccount),
}));
exports.fmsStudaccountRelations = (0, relations_1.relations)(schema_1.studentAccount, ({ one }) => ({
    bill: one(schema_1.bill, {
        fields: [schema_1.studentAccount.billId],
        references: [schema_1.bill.id]
    }),
    charge: one(schema_1.charge, {
        fields: [schema_1.studentAccount.chargeId],
        references: [schema_1.charge.id]
    }),
    session: one(schema_1.session, {
        fields: [schema_1.studentAccount.sessionId],
        references: [schema_1.session.id]
    }),
    student: one(schema_1.student, {
        fields: [schema_1.studentAccount.studentId],
        references: [schema_1.student.id]
    }),
    transaction: one(schema_1.transaction, {
        fields: [schema_1.studentAccount.transactId],
        references: [schema_1.transaction.id]
    }),
}));
exports.fmsCollectorRelations = (0, relations_1.relations)(schema_1.collector, ({ many }) => ({
    fmsTransactions: many(schema_1.transaction),
}));
exports.fmsTranstypeRelations = (0, relations_1.relations)(schema_1.transtype, ({ one, many }) => ({
    fmsTransactions: many(schema_1.transaction),
    bankacc: one(schema_1.bankacc, {
        fields: [schema_1.transtype.bankaccId],
        references: [schema_1.bankacc.id]
    }),
}));
exports.hrsCircularRelations = (0, relations_1.relations)(schema_1.circular, ({ one }) => ({
    upload: one(schema_1.upload, {
        fields: [schema_1.circular.uploadId],
        references: [schema_1.upload.id]
    }),
}));
exports.hrsUploadRelations = (0, relations_1.relations)(schema_1.upload, ({ many }) => ({
    hrsCirculars: many(schema_1.circular),
    hrsOptions: many(schema_1.option),
    hrsResponses: many(schema_1.response),
}));
exports.hrsFormRelations = (0, relations_1.relations)(schema_1.form, ({ one, many }) => ({
    formType: one(schema_1.formType, {
        fields: [schema_1.form.typeId],
        references: [schema_1.formType.id]
    }),
    hrsQuestions: many(schema_1.question),
}));
exports.hrsFormTypeRelations = (0, relations_1.relations)(schema_1.formType, ({ many }) => ({
    hrsForms: many(schema_1.form),
}));
exports.hrsLeaveRelations = (0, relations_1.relations)(schema_1.leave, ({ one }) => ({
    hrsStaff_approverId: one(schema_1.staff, {
        fields: [schema_1.leave.approverId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeave_approverId_hrsStaff_staffNo"
    }),
    leaveCategory: one(schema_1.leaveCategory, {
        fields: [schema_1.leave.leaveCategoryId],
        references: [schema_1.leaveCategory.id]
    }),
    hrsStaff_relieverId: one(schema_1.staff, {
        fields: [schema_1.leave.relieverId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeave_relieverId_hrsStaff_staffNo"
    }),
    hrsStaff_staffId: one(schema_1.staff, {
        fields: [schema_1.leave.staffId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeave_staffId_hrsStaff_staffNo"
    }),
    hrsStaff_supervisorId: one(schema_1.staff, {
        fields: [schema_1.leave.supervisorId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeave_supervisorId_hrsStaff_staffNo"
    }),
}));
exports.hrsLeaveCategoryRelations = (0, relations_1.relations)(schema_1.leaveCategory, ({ many }) => ({
    hrsLeaves: many(schema_1.leave),
    hrsLeaveWeights: many(schema_1.leaveWeight),
}));
exports.hrsLeaveApproverRelations = (0, relations_1.relations)(schema_1.leaveApprover, ({ one }) => ({
    staff: one(schema_1.staff, {
        fields: [schema_1.leaveApprover.approverId],
        references: [schema_1.staff.staffNo]
    }),
}));
exports.hrsLeaveBalanceRelations = (0, relations_1.relations)(schema_1.leaveBalance, ({ one }) => ({
    staff: one(schema_1.staff, {
        fields: [schema_1.leaveBalance.staffId],
        references: [schema_1.staff.staffNo]
    }),
}));
exports.hrsLeaveDeferRelations = (0, relations_1.relations)(schema_1.leaveDefer, ({ one }) => ({
    hrsStaff_approverId: one(schema_1.staff, {
        fields: [schema_1.leaveDefer.approverId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeaveDefer_approverId_hrsStaff_staffNo"
    }),
    hrsStaff_staffId: one(schema_1.staff, {
        fields: [schema_1.leaveDefer.staffId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeaveDefer_staffId_hrsStaff_staffNo"
    }),
    hrsStaff_supervisorId: one(schema_1.staff, {
        fields: [schema_1.leaveDefer.supervisorId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsLeaveDefer_supervisorId_hrsStaff_staffNo"
    }),
}));
exports.hrsLeaveWeightRelations = (0, relations_1.relations)(schema_1.leaveWeight, ({ one }) => ({
    leaveCategory: one(schema_1.leaveCategory, {
        fields: [schema_1.leaveWeight.leaveCategoryId],
        references: [schema_1.leaveCategory.id]
    }),
}));
exports.hrsNssRelations = (0, relations_1.relations)(schema_1.nss, ({ one }) => ({
    country: one(schema_1.country, {
        fields: [schema_1.nss.countryId],
        references: [schema_1.country.id]
    }),
    marital: one(schema_1.marital, {
        fields: [schema_1.nss.maritalId],
        references: [schema_1.marital.id]
    }),
    region: one(schema_1.region, {
        fields: [schema_1.nss.regionId],
        references: [schema_1.region.id]
    }),
    religion: one(schema_1.religion, {
        fields: [schema_1.nss.religionId],
        references: [schema_1.religion.id]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.nss.titleId],
        references: [schema_1.title.id]
    }),
    unit: one(schema_1.unit, {
        fields: [schema_1.nss.unitId],
        references: [schema_1.unit.id]
    }),
}));
exports.hrsOptionRelations = (0, relations_1.relations)(schema_1.option, ({ one }) => ({
    upload: one(schema_1.upload, {
        fields: [schema_1.option.atttachId],
        references: [schema_1.upload.id]
    }),
    question: one(schema_1.question, {
        fields: [schema_1.option.questionId],
        references: [schema_1.question.id]
    }),
}));
exports.hrsQuestionRelations = (0, relations_1.relations)(schema_1.question, ({ one, many }) => ({
    hrsOptions: many(schema_1.option),
    form: one(schema_1.form, {
        fields: [schema_1.question.formId],
        references: [schema_1.form.id]
    }),
    section: one(schema_1.section, {
        fields: [schema_1.question.sectionId],
        references: [schema_1.section.id]
    }),
    hrsResponses: many(schema_1.response),
}));
exports.hrsPositionRelations = (0, relations_1.relations)(schema_1.position, ({ one, many }) => ({
    positionInfo: one(schema_1.positionInfo, {
        fields: [schema_1.position.positionInfoId],
        references: [schema_1.positionInfo.id]
    }),
    scale: one(schema_1.scale, {
        fields: [schema_1.position.scaleId],
        references: [schema_1.scale.id]
    }),
    staff: one(schema_1.staff, {
        fields: [schema_1.position.staffNo],
        references: [schema_1.staff.staffNo],
        relationName: "hrsPosition_staffNo_hrsStaff_staffNo"
    }),
    hrsStaffs: many(schema_1.staff, {
        relationName: "hrsStaff_positionId_hrsPosition_id"
    }),
}));
exports.hrsPositionInfoRelations = (0, relations_1.relations)(schema_1.positionInfo, ({ one, many }) => ({
    hrsPositions: many(schema_1.position),
    unit: one(schema_1.unit, {
        fields: [schema_1.positionInfo.unitId],
        references: [schema_1.unit.id]
    }),
}));
exports.hrsScaleRelations = (0, relations_1.relations)(schema_1.scale, ({ many }) => ({
    hrsPositions: many(schema_1.position),
    hrsPromotions: many(schema_1.promotion),
}));
exports.hrsPromotionRelations = (0, relations_1.relations)(schema_1.promotion, ({ one, many }) => ({
    job: one(schema_1.job, {
        fields: [schema_1.promotion.jobId],
        references: [schema_1.job.id]
    }),
    scale: one(schema_1.scale, {
        fields: [schema_1.promotion.scaleId],
        references: [schema_1.scale.id]
    }),
    staff: one(schema_1.staff, {
        fields: [schema_1.promotion.staffNo],
        references: [schema_1.staff.staffNo],
        relationName: "hrsPromotion_staffNo_hrsStaff_staffNo"
    }),
    hrsStaffs_firstOfferId: many(schema_1.staff, {
        relationName: "hrsStaff_firstOfferId_hrsPromotion_id"
    }),
    hrsStaffs_promotionId: many(schema_1.staff, {
        relationName: "hrsStaff_promotionId_hrsPromotion_id"
    }),
}));
exports.hrsJobRelations = (0, relations_1.relations)(schema_1.job, ({ many }) => ({
    hrsPromotions: many(schema_1.promotion),
    hrsStaffs: many(schema_1.staff),
}));
exports.hrsSectionRelations = (0, relations_1.relations)(schema_1.section, ({ many }) => ({
    hrsQuestions: many(schema_1.question),
}));
exports.hrsRelativeRelations = (0, relations_1.relations)(schema_1.relative, ({ one }) => ({
    relation: one(schema_1.relation, {
        fields: [schema_1.relative.relationId],
        references: [schema_1.relation.id]
    }),
    staff: one(schema_1.staff, {
        fields: [schema_1.relative.staffId],
        references: [schema_1.staff.staffNo]
    }),
    title: one(schema_1.title, {
        fields: [schema_1.relative.titleId],
        references: [schema_1.title.id]
    }),
}));
exports.hrsRespondentRelations = (0, relations_1.relations)(schema_1.respondent, ({ one, many }) => ({
    hrsStaff_staffId: one(schema_1.staff, {
        fields: [schema_1.respondent.staffId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsRespondent_staffId_hrsStaff_staffNo"
    }),
    hrsStaff_supervisorId: one(schema_1.staff, {
        fields: [schema_1.respondent.supervisorId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsRespondent_supervisorId_hrsStaff_staffNo"
    }),
    hrsResponses: many(schema_1.response),
}));
exports.hrsResponseRelations = (0, relations_1.relations)(schema_1.response, ({ one }) => ({
    upload: one(schema_1.upload, {
        fields: [schema_1.response.attachId],
        references: [schema_1.upload.id]
    }),
    question: one(schema_1.question, {
        fields: [schema_1.response.questionId],
        references: [schema_1.question.id]
    }),
    respondent: one(schema_1.respondent, {
        fields: [schema_1.response.respondentId],
        references: [schema_1.respondent.id]
    }),
}));
exports.hrsTransferRelations = (0, relations_1.relations)(schema_1.transfer, ({ one }) => ({
    hrsStaff_approverId: one(schema_1.staff, {
        fields: [schema_1.transfer.approverId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsTransfer_approverId_hrsStaff_staffNo"
    }),
    hrsStaff_creatorId: one(schema_1.staff, {
        fields: [schema_1.transfer.creatorId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsTransfer_creatorId_hrsStaff_staffNo"
    }),
    unit_fromUnitId: one(schema_1.unit, {
        fields: [schema_1.transfer.fromUnitId],
        references: [schema_1.unit.id],
        relationName: "hrsTransfer_fromUnitId_unit_id"
    }),
    hrsStaff_staffId: one(schema_1.staff, {
        fields: [schema_1.transfer.staffId],
        references: [schema_1.staff.staffNo],
        relationName: "hrsTransfer_staffId_hrsStaff_staffNo"
    }),
    unit_toUnitId: one(schema_1.unit, {
        fields: [schema_1.transfer.toUnitId],
        references: [schema_1.unit.id],
        relationName: "hrsTransfer_toUnitId_unit_id"
    }),
}));
exports.ssoAroleRelations = (0, relations_1.relations)(schema_1.appRole, ({ one, many }) => ({
    app: one(schema_1.app, {
        fields: [schema_1.appRole.appId],
        references: [schema_1.app.id]
    }),
    ssoUroles: many(schema_1.userRole),
}));
exports.ssoUroleRelations = (0, relations_1.relations)(schema_1.userRole, ({ one }) => ({
    appRole: one(schema_1.appRole, {
        fields: [schema_1.userRole.appRoleId],
        references: [schema_1.appRole.id]
    }),
    user: one(schema_1.user, {
        fields: [schema_1.userRole.userId],
        references: [schema_1.user.id]
    }),
}));
