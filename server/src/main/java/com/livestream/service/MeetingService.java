package com.livestream.service;

import com.livestream.entity.Meeting;
import com.livestream.entity.UserInfo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface MeetingService {
    Meeting registerMeeting(Meeting meeting);
    int verifyMeeting(String streamId, String password);
    Meeting joinMeeting(UserInfo user, String streamId);
    List<UserInfo> getAllParticipants(int meetingId);
}
