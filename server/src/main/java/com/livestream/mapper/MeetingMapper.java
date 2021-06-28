package com.livestream.mapper;

import com.livestream.entity.Meeting;
import com.livestream.entity.UserInfo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface MeetingMapper {
    void addNewMeeting(Meeting meeting);
    Meeting getMeetingByStreamId(String streamId);
    void userJoinMeeting(int userId, int meetingId);
    List<UserInfo> getParticipantsByMeetingId(int meetingId);
}
