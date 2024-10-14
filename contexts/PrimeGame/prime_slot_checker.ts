/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/prime_slot_checker.json`.
 */
export type PrimeSlotChecker = {
  "address": "B4FMCpibTGdZhxHHNgWWnwk5PhhKdST37uFRY6TVksaj",
  "metadata": {
    "name": "primeSlotChecker",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "checkSlot",
      "discriminator": [
        12,
        92,
        254,
        148,
        136,
        195,
        252,
        186
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "jackpot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  97,
                  99,
                  107,
                  112,
                  111,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "totalWonPoints",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  116,
                  97,
                  108,
                  95,
                  119,
                  111,
                  110,
                  95,
                  112,
                  111,
                  105,
                  110,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "playerList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "leaderboard",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  97,
                  100,
                  101,
                  114,
                  98,
                  111,
                  97,
                  114,
                  100
                ]
              }
            ]
          }
        },
        {
          "name": "stakingTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "rate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "signer": true
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "claimLamports",
      "discriminator": [
        74,
        172,
        28,
        96,
        135,
        122,
        236,
        176
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "totalWonPoints",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  116,
                  97,
                  108,
                  95,
                  119,
                  111,
                  110,
                  95,
                  112,
                  111,
                  105,
                  110,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "stakingTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initialize",
      "discriminator": [
        175,
        175,
        109,
        31,
        13,
        152,
        155,
        237
      ],
      "accounts": [
        {
          "name": "jackpot",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  106,
                  97,
                  99,
                  107,
                  112,
                  111,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "playerList",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  112,
                  108,
                  97,
                  121,
                  101,
                  114,
                  95,
                  108,
                  105,
                  115,
                  116
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeLeaderboard",
      "discriminator": [
        47,
        23,
        34,
        39,
        46,
        108,
        91,
        176
      ],
      "accounts": [
        {
          "name": "leaderboard",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  108,
                  101,
                  97,
                  100,
                  101,
                  114,
                  98,
                  111,
                  97,
                  114,
                  100
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "initializeStakingTreasury",
      "discriminator": [
        90,
        190,
        230,
        213,
        10,
        100,
        238,
        18
      ],
      "accounts": [
        {
          "name": "stakingTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeTotalWonPoints",
      "discriminator": [
        119,
        150,
        31,
        179,
        166,
        222,
        44,
        230
      ],
      "accounts": [
        {
          "name": "totalWonPoints",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  116,
                  97,
                  108,
                  95,
                  119,
                  111,
                  110,
                  95,
                  112,
                  111,
                  105,
                  110,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": []
    },
    {
      "name": "initializeUser",
      "discriminator": [
        111,
        17,
        185,
        250,
        60,
        122,
        38,
        254
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "payer",
          "writable": true,
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "payForPoints",
      "discriminator": [
        126,
        237,
        77,
        66,
        18,
        223,
        54,
        8
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "treasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "stakingTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    },
    {
      "name": "tradeWonPoints",
      "discriminator": [
        74,
        130,
        125,
        11,
        95,
        186,
        184,
        132
      ],
      "accounts": [
        {
          "name": "user",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  117,
                  115,
                  101,
                  114
                ]
              },
              {
                "kind": "account",
                "path": "payer"
              }
            ]
          }
        },
        {
          "name": "rate",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  114,
                  97,
                  116,
                  101
                ]
              }
            ]
          }
        },
        {
          "name": "totalWonPoints",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  116,
                  111,
                  116,
                  97,
                  108,
                  95,
                  119,
                  111,
                  110,
                  95,
                  112,
                  111,
                  105,
                  110,
                  116,
                  115
                ]
              }
            ]
          }
        },
        {
          "name": "stakingTreasury",
          "writable": true,
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  115,
                  116,
                  97,
                  107,
                  105,
                  110,
                  103,
                  95,
                  116,
                  114,
                  101,
                  97,
                  115,
                  117,
                  114,
                  121
                ]
              }
            ]
          }
        },
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        }
      ],
      "args": [
        {
          "name": "bump",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "jackpot",
      "discriminator": [
        140,
        46,
        88,
        182,
        39,
        85,
        23,
        131
      ]
    },
    {
      "name": "leaderboard",
      "discriminator": [
        247,
        186,
        238,
        243,
        194,
        30,
        9,
        36
      ]
    },
    {
      "name": "playerList",
      "discriminator": [
        236,
        228,
        0,
        20,
        213,
        244,
        46,
        92
      ]
    },
    {
      "name": "rate",
      "discriminator": [
        171,
        48,
        95,
        14,
        112,
        112,
        23,
        79
      ]
    },
    {
      "name": "stakingTreasury",
      "discriminator": [
        132,
        181,
        181,
        12,
        8,
        0,
        201,
        46
      ]
    },
    {
      "name": "totalWonPoints",
      "discriminator": [
        73,
        210,
        188,
        209,
        113,
        241,
        147,
        187
      ]
    },
    {
      "name": "treasury",
      "discriminator": [
        238,
        239,
        123,
        238,
        89,
        1,
        168,
        253
      ]
    },
    {
      "name": "user",
      "discriminator": [
        159,
        117,
        95,
        227,
        239,
        151,
        58,
        236
      ]
    }
  ],
  "events": [
    {
      "name": "primeFound",
      "discriminator": [
        62,
        143,
        14,
        146,
        2,
        50,
        176,
        159
      ]
    }
  ],
  "types": [
    {
      "name": "jackpot",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "i64"
          },
          {
            "name": "winner",
            "type": "pubkey"
          }
        ]
      }
    },
    {
      "name": "leaderboard",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "users",
            "type": {
              "vec": {
                "defined": {
                  "name": "userEntry"
                }
              }
            }
          }
        ]
      }
    },
    {
      "name": "playerList",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "players",
            "type": {
              "vec": "pubkey"
            }
          }
        ]
      }
    },
    {
      "name": "primeFound",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "slot",
            "type": "u64"
          },
          {
            "name": "userPubkey",
            "type": "pubkey"
          },
          {
            "name": "powerUp",
            "type": "f64"
          },
          {
            "name": "numberToTest",
            "type": "u64"
          },
          {
            "name": "rewardPoints",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "rate",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "value",
            "type": "f64"
          }
        ]
      }
    },
    {
      "name": "stakingTreasury",
      "type": {
        "kind": "struct",
        "fields": []
      }
    },
    {
      "name": "totalWonPoints",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "points",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "treasury",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "amount",
            "type": "i64"
          }
        ]
      }
    },
    {
      "name": "user",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "points",
            "type": "i64"
          },
          {
            "name": "wonPoints",
            "type": "i64"
          },
          {
            "name": "lastWonSlot",
            "type": "u64"
          },
          {
            "name": "lastClaimedSlot",
            "type": "u64"
          },
          {
            "name": "lastClaimedLamports",
            "type": "u64"
          }
        ]
      }
    },
    {
      "name": "userEntry",
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "user",
            "type": "pubkey"
          },
          {
            "name": "points",
            "type": "i64"
          }
        ]
      }
    }
  ]
};
