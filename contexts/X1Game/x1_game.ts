/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/x1_game.json`.
 */
export type X1Game = {
  address: '8yeFvD9rxGdhBcwCKgtzQwjgZVa7EJW3aK6uxoGB6Kj7';
  metadata: {
    name: 'x1Game';
    version: '0.1.0';
    spec: '0.1.0';
    description: 'Created with Anchor';
  };
  instructions: [
    {
      name: 'click';
      discriminator: [11, 147, 179, 178, 145, 118, 45, 186];
      accounts: [
        {
          name: 'x1GameState';
          writable: true;
        },
        {
          name: 'x1RoundState';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 103, 97, 109, 101, 45, 114, 111, 117, 110, 100];
              },
              {
                kind: 'arg';
                path: 'round';
              }
            ];
          };
        },
        {
          name: 'x1UserRoundState';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 117, 115, 101, 114, 45, 114, 111, 117, 110, 100];
              },
              {
                kind: 'arg';
                path: 'round';
              },
              {
                kind: 'account';
                path: 'user';
              }
            ];
          };
        },
        {
          name: 'x1UserState';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 103, 97, 109, 101, 45, 117, 115, 101, 114];
              },
              {
                kind: 'account';
                path: 'user';
              }
            ];
          };
        },
        {
          name: 'user';
          writable: true;
          signer: true;
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'round';
          type: 'u64';
        }
      ];
    },
    {
      name: 'initialize';
      discriminator: [175, 175, 109, 31, 13, 152, 155, 237];
      accounts: [
        {
          name: 'x1GameState';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 103, 97, 109, 101];
              }
            ];
          };
        },
        {
          name: 'admin';
          writable: true;
          signer: true;
        },
        {
          name: 'mintAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 103, 97, 109, 101, 45, 109, 105, 110, 116];
              }
            ];
          };
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'rent';
          address: 'SysvarRent111111111111111111111111111111111';
        }
      ];
      args: [
        {
          name: 'params';
          type: {
            defined: {
              name: 'initTokenParams';
            };
          };
        }
      ];
    },
    {
      name: 'mint';
      discriminator: [51, 57, 225, 47, 182, 146, 137, 166];
      accounts: [
        {
          name: 'userTokenAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'account';
                path: 'user';
              },
              {
                kind: 'const';
                value: [
                  6,
                  221,
                  246,
                  225,
                  215,
                  101,
                  161,
                  147,
                  217,
                  203,
                  225,
                  70,
                  206,
                  235,
                  121,
                  172,
                  28,
                  180,
                  133,
                  237,
                  95,
                  91,
                  55,
                  145,
                  58,
                  140,
                  245,
                  133,
                  126,
                  255,
                  0,
                  169
                ];
              },
              {
                kind: 'account';
                path: 'mintAccount';
              }
            ];
            program: {
              kind: 'const';
              value: [
                140,
                151,
                37,
                143,
                78,
                36,
                137,
                241,
                187,
                61,
                16,
                41,
                20,
                142,
                13,
                131,
                11,
                90,
                19,
                153,
                218,
                255,
                16,
                132,
                4,
                142,
                123,
                216,
                219,
                233,
                248,
                89
              ];
            };
          };
        },
        {
          name: 'x1GameState';
          writable: true;
        },
        {
          name: 'x1RoundState';
          writable: true;
        },
        {
          name: 'x1UserRoundState';
          writable: true;
        },
        {
          name: 'x1UserState';
          writable: true;
        },
        {
          name: 'user';
          writable: true;
          signer: true;
        },
        {
          name: 'mintAccount';
          writable: true;
          pda: {
            seeds: [
              {
                kind: 'const';
                value: [120, 49, 45, 103, 97, 109, 101, 45, 109, 105, 110, 116];
              }
            ];
          };
        },
        {
          name: 'tokenProgram';
          address: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';
        },
        {
          name: 'systemProgram';
          address: '11111111111111111111111111111111';
        },
        {
          name: 'associatedTokenProgram';
          address: 'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL';
        }
      ];
      args: [
        {
          name: 'round';
          type: 'u64';
        }
      ];
    }
  ];
  accounts: [
    {
      name: 'x1GameState';
      discriminator: [200, 158, 125, 225, 99, 1, 249, 31];
    },
    {
      name: 'x1RoundState';
      discriminator: [178, 137, 198, 245, 73, 182, 215, 240];
    },
    {
      name: 'x1UserRoundState';
      discriminator: [189, 15, 73, 32, 151, 227, 245, 231];
    },
    {
      name: 'x1UserState';
      discriminator: [229, 173, 117, 242, 182, 188, 247, 143];
    }
  ];
  errors: [
    {
      code: 6000;
      name: 'mintIsAlreadyActive';
      msg: 'X1Game Mint has been already initialized';
    },
    {
      code: 6001;
      name: 'mintIsNotActive';
      msg: 'X1Game Mint has not yet started or is over';
    },
    {
      code: 6002;
      name: 'badSlotValue';
      msg: 'Slot value is Out of Order';
    },
    {
      code: 6003;
      name: 'badParam';
      msg: 'Bad param value';
    },
    {
      code: 6004;
      name: 'wrongRound';
      msg: 'Wrong round';
    },
    {
      code: 6005;
      name: 'alreadyMinted';
      msg: 'Already minted';
    }
  ];
  types: [
    {
      name: 'initTokenParams';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'name';
            type: 'string';
          },
          {
            name: 'symbol';
            type: 'string';
          },
          {
            name: 'uri';
            type: 'string';
          },
          {
            name: 'decimals';
            type: 'u8';
          }
        ];
      };
    },
    {
      name: 'x1GameState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'lastRoundSlot';
            type: 'u64';
          },
          {
            name: 'currentRound';
            type: 'u64';
          },
          {
            name: 'totalPoints';
            type: 'u128';
          }
        ];
      };
    },
    {
      name: 'x1RoundState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'cap';
            type: 'u128';
          },
          {
            name: 'totalPoints';
            type: 'u128';
          }
        ];
      };
    },
    {
      name: 'x1UserRoundState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'points';
            type: 'u128';
          },
          {
            name: 'mintedPoints';
            type: 'u128';
          }
        ];
      };
    },
    {
      name: 'x1UserState';
      type: {
        kind: 'struct';
        fields: [
          {
            name: 'lastRound';
            type: 'u64';
          },
          {
            name: 'score';
            type: 'u64';
          },
          {
            name: 'userPoints';
            type: 'u128';
          }
        ];
      };
    }
  ];
};
