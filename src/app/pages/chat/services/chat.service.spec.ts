import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ChatService } from './chat.service';
import { ChatMessage, ChatConversation } from '../interfaces/chat.interface';

describe('ChatService', () => {
  let service: ChatService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ChatService]
    });

    service = TestBed.inject(ChatService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get messages for a conversation', (done) => {
    const conversationId = 'conv-1';

    service.getMessages(conversationId).subscribe(messages => {
      expect(messages).toEqual([]);
      done();
    });
  });

  it('should send a message', (done) => {
    const conversationId = 'conv-1';
    const content = 'Test message';

    service.sendMessage(conversationId, content).subscribe(message => {
      expect(message.content).toBe(content);
      expect(message.isOwnMessage).toBe(true);
      done();
    });
  });

  it('should get conversations list', (done) => {
    service.getConversations().subscribe(conversations => {
      expect(conversations).toEqual([]);
      done();
    });
  });

  it('should get participant details', (done) => {
    const participantId = 'seller-1';

    service.getParticipant(participantId).subscribe(participant => {
      expect(participant.id).toBe(participantId);
      done();
    });
  });
});

