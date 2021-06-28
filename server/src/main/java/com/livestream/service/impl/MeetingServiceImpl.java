package com.livestream.service.impl;

import com.livestream.entity.Meeting;
import com.livestream.entity.UserInfo;
import com.livestream.mapper.MeetingMapper;
import com.livestream.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MeetingServiceImpl implements MeetingService {
    private final MeetingMapper meetingMapper;

    @Autowired
    public MeetingServiceImpl(MeetingMapper meetingMapper) {
        this.meetingMapper = meetingMapper;
    }

    @Override
    public Meeting registerMeeting(Meeting meeting) {
        // Generate a unique id for the live stream
        String streamId = UUID.randomUUID().toString().replace("-", "");
        meeting.setStreamId(streamId);
        meetingMapper.addNewMeeting(meeting);
        return meeting;
    }

    @Override
    public int verifyMeeting(String streamId, String password) {
        /*
            flag 0: No meeting available
            flag 1: Require Password
            flag 2: Password incorrect
            flag 3: Pass validation
         */
        Meeting meeting = meetingMapper.getMeetingByStreamId(streamId);
        if (meeting == null)
            return 0;
        if (meeting.isAuthRequired()) {
            if (password.equals("")) {
                return 1;
            } else if (password.equals(meeting.getPassword())) {
                return 3;
            } else {
                return 2;
            }
        } else {
            return 3;
        }
    }

    @Override
    public Meeting joinMeeting(UserInfo user, String streamId) {
        Meeting meeting = meetingMapper.getMeetingByStreamId(streamId);
        meetingMapper.userJoinMeeting(user.getUid(), meeting.getUid());
        return meeting;
    }

    @Override
    public List<UserInfo> getAllParticipants(int meetingId) {
        return meetingMapper.getParticipantsByMeetingId(meetingId);
    }
}
