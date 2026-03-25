const User = require('./User');
const Course = require('./Course');
const Material = require('./Material');
const Attendance = require('./Attendance');
const Notification = require('./Notification');
const { Announcement, AnnouncementRead } = require('./Announcement');
const { Assessment, AssessmentMark } = require('./Assessment');
const { Assignment, Submission } = require('./Assignment');
const { Conversation, Message } = require('./Chat');

function initAssociations() {
  // User ↔ Course
  Course.belongsTo(User, { as: 'lecturer', foreignKey: 'lecturerId' });
  User.hasMany(Course, { as: 'coursesAsLecturer', foreignKey: 'lecturerId' });

  // Announcements
  Announcement.belongsTo(User, { as: 'postedBy', foreignKey: 'postedById' });
  Announcement.belongsTo(Course, { as: 'course', foreignKey: 'courseId' });
  AnnouncementRead.belongsTo(Announcement, { foreignKey: 'announcementId' });
  AnnouncementRead.belongsTo(User, { foreignKey: 'userId' });

  // Materials
  Material.belongsTo(Course, { foreignKey: 'courseId' });
  Material.belongsTo(User, { as: 'uploadedBy', foreignKey: 'uploadedById' });

  // Assignments & submissions
  Assignment.belongsTo(Course, { foreignKey: 'courseId' });
  Assignment.belongsTo(User, { as: 'createdBy', foreignKey: 'createdById' });
  Submission.belongsTo(Assignment, { foreignKey: 'assignmentId' });
  Submission.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
  Submission.belongsTo(User, { as: 'gradedBy', foreignKey: 'gradedById' });

  // Attendance
  Attendance.belongsTo(Course, { foreignKey: 'courseId' });
  Attendance.belongsTo(User, { as: 'student', foreignKey: 'studentId' });
  Attendance.belongsTo(User, { as: 'markedBy', foreignKey: 'markedById' });

  // Assessments
  Assessment.belongsTo(Course, { foreignKey: 'courseId' });
  AssessmentMark.belongsTo(Assessment, { foreignKey: 'assessmentId' });
  AssessmentMark.belongsTo(User, { as: 'student', foreignKey: 'studentId' });

  // Chat
  Conversation.belongsTo(User, { as: 'user1', foreignKey: 'user1Id' });
  Conversation.belongsTo(User, { as: 'user2', foreignKey: 'user2Id' });
  Message.belongsTo(Conversation, { foreignKey: 'conversationId' });
  Message.belongsTo(User, { as: 'sender', foreignKey: 'senderId' });

  // Notifications
  Notification.belongsTo(User, { foreignKey: 'userId' });
}

initAssociations();

module.exports = {
  User,
  Course,
  Material,
  Attendance,
  Notification,
  Announcement,
  AnnouncementRead,
  Assessment,
  AssessmentMark,
  Assignment,
  Submission,
  Conversation,
  Message,
};

