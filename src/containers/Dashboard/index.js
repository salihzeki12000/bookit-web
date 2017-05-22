import React, { PropTypes } from 'react';

import moment from 'moment';

import { connect } from 'react-redux';

import styles from './styles.scss';

import Agenda from '../../components/03-organisms/Agenda';
import Calendar from '../../components/01-atoms/Calendar';
import Messages from '../../components/02-molecules/Messages';
import ReservationList from '../../components/02-molecules/ReservationList';

import MeetingCancel from '../../components/02-molecules/MeetingCancel';

import MeetingForm from '../MeetingForm';

import {
  meetingsFetchStart,
  populateMeetingCreateForm,
  populateMeetingEditForm,
  logout,
 } from '../../actions';

export class DashboardContainer extends React.Component {
  componentDidMount() {
    // This fetches meetings. It should happen whenever `selectedDate` is updated.
    this.props.requestRooms();
  }

  leftPaneContent() {
    if (this.props.isEditingMeeting) { return <MeetingForm />; }
    if (this.props.isCreatingMeeting) { return <MeetingForm />; }
    if (this.props.isCancellingMeeting) { return (<MeetingCancel />); }
    return (<Calendar selectedDate={this.props.selectedDate} />);
  }

  render() {
    return (
      <div className={styles.app}>
        <div className={styles.container}>
          <div className={styles.leftPane}>
            { this.leftPaneContent() }
            <Messages messages={this.props.messages} />
            <ReservationList
              roomMeetings={this.props.rooms}
              handleEditClick={this.props.populateMeetingEditForm}
            />
          </div>
          <div className={styles.user}>
            <span className={styles.hello}>Hello</span>
            <span className={styles.name}>
              { this.props.userName }!
            </span>
            <span className={styles.logout} onClick={this.props.logout}>Log Out</span>
          </div>
          <Agenda
            roomMeetings={this.props.rooms}
            populateMeetingCreateForm={this.props.populateMeetingCreateForm}
          />
        </div>
      </div>
    );
  }
}

DashboardContainer.propTypes = {
  requestRooms: PropTypes.func,
  userName: PropTypes.string,
  rooms: PropTypes.arrayOf(PropTypes.object),
  populateMeetingCreateForm: PropTypes.func.isRequired,
  populateMeetingEditForm: PropTypes.func.isRequired,
  isEditingMeeting: PropTypes.bool,
  isCreatingMeeting: PropTypes.bool.isRequired,
  isCancellingMeeting: PropTypes.bool,
  messages: PropTypes.arrayOf(PropTypes.string),
  logout: PropTypes.func.isRequired,
  selectedDate: PropTypes.shape({}),
};

const mapMeeting = (roomMeetings, user, requestedMeeting = {}) => {
  const meetings = roomMeetings.meetings.map(meeting => {
    const startMoment = moment(meeting.start);
    const endMoment = moment(meeting.end);
    const duration = endMoment.diff(startMoment, 'minutes') / 60;
    // TODO: Filter by `isOwnedByUser` once the server serves up the goods.
    // Also change this in molecules/ReservationList
    // const isOwnedByUser = meeting.owner && (user.email === meeting.owner.email);
    const isOwnedByUser = (meeting.owner.name === 'Comes from the session!!!')
    const isSelected = meeting.id === requestedMeeting.id;

    return {
      room: roomMeetings.room,
      id: meeting.id,
      startTime: moment(meeting.start).format('YYYY-MM-DDTHH:mm:ssZ'),
      duration,
      start: moment(meeting.start),
      end: moment(meeting.end),
      isOwnedByUser,
      participants: meeting.participants,
      owner: meeting.owner,
      title: meeting.title,
      isSelected,
    };
  });

  return {
    room: roomMeetings.room,
    meetings,
  };
};

const mapStateToProps = state => ({
  userName: state.user.name,
  // TODO: Rename `rooms`. This is not really a list of rooms.
  rooms: state.app.meetings.map(rm => mapMeeting(rm, state.user, state.app.requestedMeeting)),
  isCreatingMeeting: state.app.isCreatingMeeting,
  isEditingMeeting: state.app.isEditingMeeting,
  isCancellingMeeting: state.app.isCancellingMeeting,
  meetingEditForm: state.app.meetingEditForm,
  messages: state.app.messages,
  selectedDate: moment(state.app.selectedDate),
  requestedMeeting: state.app.requestedMeeting,
});

const mapDispatchToProps = dispatch => ({
  requestRooms: () => {
    // Why does `requestRooms` fetch Meetings?
    // TODO: Fetch meetings for selectedDate.
    dispatch(meetingsFetchStart());
  },
  populateMeetingCreateForm: (room, meeting) => {
    dispatch(populateMeetingCreateForm(room, meeting));
  },
  populateMeetingEditForm: meeting => {
    dispatch(populateMeetingEditForm(meeting));
  },
  logout: () => {
    dispatch(logout());
  },
});

const connected = connect(
  mapStateToProps,
  mapDispatchToProps,
)(DashboardContainer);

export default connected;
