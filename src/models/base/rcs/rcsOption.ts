import {Schema} from 'effect';
import {RcsButton, rcsButtonSchema} from './rcsButton';

/**
 * RCS 사진문자 발송 시 필요한 오브젝트
 */
export type AdditionalBody = {
  /**
   * 슬라이드 제목
   */
  title: string;
  /**
   * 슬라이드 설명
   */
  description: string;
  /**
   * MMS 발송 시 사용되는 이미지의 고유 아이디. 이미지 타입이 MMS일 경우에만 사용 가능합니다.
   * @see https://console.solapi.com/storage
   * @see https://developers.solapi.com/references/storage
   */
  imaggeId?: string;
  /**
   * 	슬라이드에 추가되는 버튼 목록, 최대 2개
   */
  buttons?: ReadonlyArray<RcsButton>;
};

export const additionalBodySchema = Schema.Struct({
  title: Schema.String,
  description: Schema.String,
  imaggeId: Schema.optional(Schema.String),
  buttons: Schema.optional(Schema.Array(rcsButtonSchema)),
});

/**
 * RCS 발송을 위한 파라미터 타입
 */
export type RcsOptionRequest = {
  /**
   * RCS 채널의 브랜드 ID
   */
  brandId: string;
  /**
   * RCS 템플릿 ID
   */
  templateId?: string;
  /**
   * 문자 복사 가능 여부
   */
  copyAllowed?: boolean;
  /**
   * RCS 템플릿 대체 문구 입력 오브젝트
   * 예) { #{치환문구1} : "치환문구 값" }
   */
  variables?: Record<string, string>;
  /**
   * 사진 문자 타입. 타입: "M3", "S3", "M4", "S4", "M5", "S5", "M6", "S6" (M: 중간 사이즈. S: 작은 사이즈. 숫자: 사진 개수)
   */
  mmsType?: 'M3' | 'S3' | 'M4' | 'S4' | 'M5' | 'S5' | 'M6' | 'S6';
  /**
   * 광고 문자 여부
   */
  commercialType?: boolean;
  /**
   * 대체발송여부. false 로 설정했을 경우 해당건이 발송에 실패하게 됐을 때 문자로(SMS, LMS, MMS)로 대체 발송됩니다. 대체 발송이 될 경우 기존 가격은 환불되고 각 문자 타입에 맞는 금액이 차감됩니다. 기본값: false
   */
  disableSms?: boolean;
  /**
   * RCS 사진 문자 전송 시 필요한 오브젝트
   */
  additionalBody?: AdditionalBody;
  /**
   * RCS 템플릿 버튼 배열
   */
  buttons?: ReadonlyArray<RcsButton>;
};

export const rcsOptionRequestSchema = Schema.Struct({
  brandId: Schema.String,
  templateId: Schema.optional(Schema.String),
  copyAllowed: Schema.optional(Schema.Boolean),
  variables: Schema.optional(
    Schema.Record({key: Schema.String, value: Schema.String}),
  ),
  mmsType: Schema.optional(
    Schema.Literal('M3', 'S3', 'M4', 'S4', 'M5', 'S5', 'M6', 'S6'),
  ),
  commercialType: Schema.optional(Schema.Boolean),
  disableSms: Schema.optional(Schema.Boolean),
  additionalBody: Schema.optional(additionalBodySchema),
  buttons: Schema.optional(Schema.Array(rcsButtonSchema)),
});

export const rcsOptionSchema = rcsOptionRequestSchema;

export type RcsOptionSchema = Schema.Schema.Type<typeof rcsOptionSchema>;

export class RcsOption {
  brandId: string;
  templateId?: string;
  copyAllowed?: boolean;
  variables?: Record<string, string>;
  mmsType?: 'M3' | 'S3' | 'M4' | 'S4' | 'M5' | 'S5' | 'M6' | 'S6'; // (M: 중간 사이즈. S: 작은 사이즈. 숫자: 사진 개수)
  commercialType?: boolean;
  disableSms?: boolean;
  additionalBody?: AdditionalBody;
  buttons?: ReadonlyArray<RcsButton>;

  constructor(parameter: RcsOptionRequest) {
    this.brandId = parameter.brandId;
    this.templateId = parameter.templateId;
    this.copyAllowed = parameter.copyAllowed;
    this.mmsType = parameter.mmsType;
    this.commercialType = parameter.commercialType;
    this.variables = parameter.variables;
    this.disableSms = parameter.disableSms;
    this.additionalBody = parameter.additionalBody;
    this.buttons = parameter.buttons;
  }
}
