import React, { PropTypes } from 'react';
import styles from './styles.scss';
import TimelineLabelList from '../../01-atoms/TimelineLabelList';
import RoomTimeline from '../../02-molecules/RoomTimeline';
import CurrentTimeIndicator from '../../01-atoms/CurrentTimeIndicator';

const Agenda = ({ roomMeetings = [], populateMeetingForm }) => (
  <div className={styles.agenda}>
    <TimelineLabelList />
    { roomMeetings.map(roomMeeting => (
      <RoomTimeline
        key={roomMeeting.room.name}
        room={roomMeeting.room}
        meetings={roomMeeting.meetings}
        populateMeetingForm={populateMeetingForm}
      />
      )) }
    <CurrentTimeIndicator />
  </div>
  );

Agenda.propTypes = {
  roomMeetings: PropTypes.arrayOf(PropTypes.shape({
    room: PropTypes.shape({
      name: PropTypes.string,
      email: PropTypes.string,
    }).isRequired,
    meetings: PropTypes.arrayOf(PropTypes.shape({
      title: PropTypes.string,
      participants: PropTypes.array,
      owner: PropTypes.object,
      start: PropTypes.object,
      end: PropTypes.object,
    })),
  })),
  populateMeetingForm: PropTypes.func.isRequired,
};

export default Agenda;
