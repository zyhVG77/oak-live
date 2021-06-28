package com.livestream.controller;

import com.livestream.entity.ChatMessage;
import com.livestream.entity.Meeting;
import com.livestream.entity.UserInfo;
import com.livestream.service.MeetingService;
import com.livestream.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/api")
public class MeetingController {
    private final MeetingService meetingService;
    private final UserService userService;
    private final SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    public MeetingController(MeetingService meetingService,
                             UserService userService,
                             SimpMessagingTemplate simpMessagingTemplate) {
        this.meetingService = meetingService;
        this.userService = userService;
        this.simpMessagingTemplate = simpMessagingTemplate;
    }

    @PostMapping("/open-meeting")
    public Meeting openMeeting(@RequestHeader("Authentication") String token,
                                           @RequestBody Meeting meeting) {
        // TODO Parse token for the account id
        int id = Integer.parseInt(token);
        UserInfo host = userService.getUserInfo(id);
        meeting.setHost(host);
        return meetingService.registerMeeting(meeting);
    }

    @GetMapping("/join-meeting")
    public Map<String, ?> joinMeeting(@RequestHeader("Authentication") String token,
                               @RequestParam("meeting_id") String streamId,
                               @RequestParam("password") String password) {
        /*
            flag 0: No meeting available
            flag 1: Require Password
            flag 2: Password incorrect
            flag 3: Pass validation
         */
        int flag = meetingService.verifyMeeting(streamId, password);
        switch (flag) {
            case 0:
                return Map.of("state", 0);
            case 1:
                return Map.of("state", 1);
            case 2:
                return Map.of("state", 2);
            case 3:
                break;
        }
        // TODO Parse token for the account id
        int id = Integer.parseInt(token);
        UserInfo user = userService.getUserInfo(id);
        Meeting meeting = meetingService.joinMeeting(user, streamId);

        // Broadcast to every client that a new client has joint the meeting
        ChatMessage message = ChatMessage.of();
        message.setType("system-message");
        message.setContent("新成员加入 -> " + user.getName());
        simpMessagingTemplate.convertAndSend("/topic/broadcast", message);

        return Map.of(
                "state", 3,
                "meeting", meeting
        );
    }

    @GetMapping("get-participants-info")
    public Map<String, ?> getParticipantsInfo(@RequestParam("meeting_id") int meetingId) {
        List<UserInfo> participants = meetingService.getAllParticipants(meetingId);
        return Map.of("number", participants.size(), "participants", participants);
    }
}
