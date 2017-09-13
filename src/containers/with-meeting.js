// import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { connect } from 'react-redux'
import { createPropsSelector } from 'reselect-immutable-helpers'

import {
  getMeetingTitle,
  getMeetingStart,
  getMeetingEnd,
  getMeetingRoomName,
  isMeetingOwner,
} from '../selectors'

export default (WrappedComponent) => {
  const mapStateToProps = createPropsSelector({
    title: getMeetingTitle,
    start: getMeetingStart,
    end: getMeetingEnd,
    roomName: getMeetingRoomName,
    isMeetingOwner: isMeetingOwner,
  })

  // Object.assign({}, ownProps, stateProps, dispatchProps)
  const mergeProps = (stateProps, dispatchProps, ownProps) => ({
    ...ownProps,
    ...stateProps,
  })

  const withMeeting = connect(mapStateToProps, {}, mergeProps)(WrappedComponent)

  withMeeting.propTypes = {
    id: PropTypes.string.isRequired,
  }

  return withMeeting
}