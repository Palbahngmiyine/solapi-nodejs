import {messageSchema} from '@models/base/messages/message';
import {Schema} from 'effect';
import {defaultAgentTypeSchema} from './requestConfig';

export const phoneNumberSchema = Schema.String.pipe(
  Schema.transform(Schema.String, {
    decode: s => s.replace(/-/g, ''),
    encode: s => s,
  }),
);

// 빈 배열 검증을 위한 재사용 가능한 필터
const nonEmptyArrayFilter = <A>(schema: Schema.Schema<A>) =>
  Schema.Array(schema).pipe(
    Schema.filter(arr => arr.length > 0, {
      message: () => '데이터가 반드시 1건 이상 기입되어 있어야 합니다.',
    }),
  );

/**
 * 단건 메시지 발송 요청 모델
 * @description 단건 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 * ```
 */
export const requestSendOneMessageSchema = messageSchema.pipe(
  Schema.omit('to', 'from'),
  Schema.extend(
    Schema.Struct({
      to: Schema.Union(phoneNumberSchema, Schema.Array(phoneNumberSchema)),
      from: Schema.optional(phoneNumberSchema),
    }),
  ),
);

/**
 * 메시지 발송 요청 모델
 * @description 메시지 발송 요청 모델
 * @example
 * ```ts
 * const message = {
 *  to: '01012345678',
 *  from: '01012345678',
 *  text: 'Hello, world!',
 * };
 *
 * // 혹은..
 * const messages = [
 *  {
 *    to: '01012345678',
 *    from: '01012345678',
 *    text: 'Hello, world!',
 *  },
 * ];
 * ```
 */
export const requestSendMessageSchema = Schema.Union(
  requestSendOneMessageSchema,
  nonEmptyArrayFilter(requestSendOneMessageSchema),
);

export type RequestSendOneMessageSchema = Schema.Schema.Type<
  typeof requestSendOneMessageSchema
>;

export type RequestSendMessagesSchema = Schema.Schema.Type<
  typeof requestSendMessageSchema
>;

// 기본 Agent 객체 (sdkVersion, osPlatform 값 포함) – 빈 객체 디코딩으로 생성
const defaultAgentValue = Schema.decodeSync(defaultAgentTypeSchema)({});

// Agent 스키마의 재사용 가능한 정의
const agentWithDefaultSchema = Schema.optional(defaultAgentTypeSchema).pipe(
  Schema.withDecodingDefault(() => defaultAgentValue),
  Schema.withConstructorDefault(() => defaultAgentValue),
);

export const singleMessageSendingRequestSchema = Schema.Struct({
  message: requestSendOneMessageSchema,
  agent: agentWithDefaultSchema,
});

export const multipleMessageSendingRequestSchema = Schema.Struct({
  allowDuplicates: Schema.optional(Schema.Boolean),
  agent: agentWithDefaultSchema,
  messages: nonEmptyArrayFilter(requestSendOneMessageSchema),
  scheduledDate: Schema.optional(
    Schema.Union(Schema.DateFromSelf, Schema.DateFromString),
  ),
  showMessageList: Schema.optional(Schema.Boolean),
});

export type MultipleMessageSendingRequestSchema = Schema.Schema.Type<
  typeof multipleMessageSendingRequestSchema
>;

export type SingleMessageSendingRequestSchema = Schema.Schema.Type<
  typeof singleMessageSendingRequestSchema
>;
