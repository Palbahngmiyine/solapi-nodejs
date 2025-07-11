import {
  KakaoChannel,
  KakaoChannelInterface,
} from '../../base/kakao/kakaoChannel';

export type GetKakaoChannelsResponse = {
  limit: number;
  startKey: string;
  nextKey: string | null;
  channelList: Array<KakaoChannelInterface>;
};

export type GetKakaoChannelsFinalizeResponse = {
  limit: number;
  startKey: string;
  nextKey: string | null;
  channelList: Array<KakaoChannel>;
};
