require('jest-fetch-mock').enableMocks();

const twitchAPI = require('./twitch-api');

/**
 * Fixture.
 * See https://dev.twitch.tv/docs/api/reference#get-streams
 * Using these queries:
 * - `user_login=gaules`
 */
const __TWITCH__streams = {
  offline: {
    data: [],
    pagination: {},
  },

  online: {
    data: [
      {
        id: '39541877533',
        user_id: '181077473',
        user_name: 'Gaules',
        game_id: '32399',
        type: 'live',
        title:
          'Furia vs 100T IEM NEW YORK GRANDE FINAL @Gaules nas Redes Sociais !premio !prime !Sorteio PC Gamer',
        viewer_count: 92696,
        started_at: '2020-10-18T21:09:21Z',
        language: 'pt',
        thumbnail_url:
          'https://static-cdn.jtvnw.net/previews-ttv/live_user_gaules-{width}x{height}.jpg',
        tag_ids: [
          '39ee8140-901a-4762-bfca-8260dea1310f',
          '3e10beee-52d8-4e68-89b7-dc4f20a47f86',
        ],
      },
    ],
    pagination: {},
  },
};

describe('Twitch api service', () => {
  const twitchClientId = '1260vxfoohxs01rc4l9n71gyi13gv'; // fake
  const twitchOAuthAccessToken = '1oh0lk96y1xcaf7Iz11sa8qf5i1330'; // fake
  const twitchChannel = 'gaules';

  let api;

  beforeEach(() => {
    fetch.resetMocks();

    api = twitchAPI(twitchClientId, twitchOAuthAccessToken);
  });

  describe('twitchApi.getStream(...)', () => {
    const fetchMockHelixStreams = fetch.doMockIf(
      new RegExp('https://api.twitch.tv/helix/streams/.?user_login=gaules'),
    );

    it('Should make requests with the right HTTP headers', async () => {
      fetch.mockResponseOnce(JSON.stringify({})); // we don't care about the response body

      try {
        await api.getStream(twitchChannel);
      } catch (_err) {} // ignore expected errors

      const fetchFirstCall = fetch.mock.calls[0];

      const clientId = fetchFirstCall[1].headers['Client-ID'];
      const authorization = fetchFirstCall[1].headers['Authorization'];

      expect(clientId).toBe(twitchClientId);
      expect(authorization).toBe('Bearer ' + twitchOAuthAccessToken);
    });

    it('Should return an object with `.isLive:true`, and the expected stream title value on `.title`, when the channel is online', async () => {
      const fixtureStream = __TWITCH__streams.online;
      fetchMockHelixStreams.mockResponse(JSON.stringify(fixtureStream));

      const { isLive, ...streamData } = await api.getStream(twitchChannel);
      expect(isLive).toBe(true);
      expect(streamData.title).toBe(fixtureStream.data[0].title);
    });

    it('Should return an object with `.isLive:false`, and only this property, when the channel is offline', async () => {
      const fixtureStream = __TWITCH__streams.offline;
      fetchMockHelixStreams.mockResponse(JSON.stringify(fixtureStream));

      const { isLive, ...streamData } = await api.getStream(twitchChannel);
      expect(isLive).toBe(false);
      expect(streamData).toMatchObject({});
    });
  });
});
