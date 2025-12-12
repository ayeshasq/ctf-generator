React.createElement('div', { style: { textAlign: 'center', marginBottom: '40px', paddingTop: '40px' } },
    React.createElement('div', { style: { fontSize: '60px', marginBottom: '20px' } }, '🛡️'),
    React.createElement('h1', { 
      style: { 
        fontSize: '48px', 
        fontWeight: 'bold', 
        marginBottom: '10px',
        background: 'linear-gradient(to right, #c084fc, #ec4899, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }
    }, 'AI CTF Challenge Generator'),
    React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db' } }, 
      'Generate unique hacking challenges in 30 seconds'
    )
  ),

  !challenge && React.createElement('div', {
    style: {
      background: 'rgba(31, 41, 55, 0.5)',
      backdropFilter: 'blur(12px)',
      borderRadius: '24px',
      padding: '40px',
      marginBottom: '30px',
      border: '1px solid rgba(168, 85, 247, 0.2)'
    }
  },
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px' } },
      
      React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' } },
          'Challenge Category'
        ),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' } },
          categories.map(function(cat) {
            return React.createElement('button', {
              key: cat.id,
              onClick: function() { setSelectedCategory(cat.id); },
              style: {
                padding: '20px',
                borderRadius: '12px',
                border: selectedCategory === cat.id ? '2px solid white' : '2px solid #4b5563',
                background: selectedCategory === cat.id ? 'linear-gradient(to right, #a855f7, #ec4899)' : 'rgba(55, 65, 81, 0.5)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                fontSize: '12px',
                fontWeight: '500'
              }
            },
              React.createElement('div', { style: { fontSize: '24px', marginBottom: '8px' } }, cat.emoji),
              cat.name
            );
          })
        )
      ),

      React.createElement('div', null,
        React.createElement('label', { style: { display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '15px', color: '#c084fc' } },
          'Difficulty Level'
        ),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '10px' } },
          ['easy', 'medium', 'hard'].map(function(level) {
            return React.createElement('button', {
              key: level,
              onClick: function() { setDifficulty(level); },
              style: {
                padding: '16px',
                borderRadius: '12px',
                border: difficulty === level ? '2px solid white' : '2px solid #4b5563',
                background: difficulty === level ? 'linear-gradient(to right, #10b981, #3b82f6)' : 'rgba(55, 65, 81, 0.5)',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontWeight: '600',
                textTransform: 'capitalize'
              }
            },
              React.createElement('span', null, level),
              React.createElement('span', { style: { fontSize: '14px' } },
                level === 'easy' ? '100 pts' : level === 'medium' ? '250 pts' : '500 pts'
              )
            );
          })
        )
      )
    ),

    React.createElement('button', {
      onClick: generateChallenge,
      disabled: loading,
      style: {
        width: '100%',
        marginTop: '32px',
        padding: '20px',
        background: loading ? 'linear-gradient(to right, #4b5563, #6b7280)' : 'linear-gradient(to right, #9333ea, #ec4899)',
        border: 'none',
        borderRadius: '12px',
        color: 'white',
        fontSize: '18px',
        fontWeight: 'bold',
        cursor: loading ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px'
      }
    },
      loading ? '⏳ Generating Challenge...' : '🎲 Generate ' + difficulty.charAt(0).toUpperCase() + difficulty.slice(1) + ' Challenge'
    )
  ),

  challenge && React.createElement('div', null,
    React.createElement('div', {
      style: {
        background: 'rgba(147, 51, 234, 0.2)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(168, 85, 247, 0.3)'
      }
    },
      React.createElement('div', { style: { marginBottom: '20px' } },
        React.createElement('h2', { style: { fontSize: '32px', fontWeight: 'bold', marginBottom: '10px' } },
          challenge.data.title
        ),
        React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '15px' } },
          React.createElement('span', { 
            style: { 
              fontSize: '12px', 
              padding: '6px 12px', 
              background: 'rgba(168, 85, 247, 0.3)', 
              borderRadius: '20px' 
            }
          }, challenge.category.toUpperCase()),
          React.createElement('span', { 
            style: { 
              fontSize: '12px', 
              padding: '6px 12px', 
              background: 'rgba(59, 130, 246, 0.3)', 
              borderRadius: '20px' 
            }
          }, challenge.difficulty.toUpperCase()),
          React.createElement('span', { 
            style: { 
              fontSize: '12px', 
              padding: '6px 12px', 
              background: 'rgba(234, 179, 8, 0.3)', 
              borderRadius: '20px' 
            }
          }, '⚡ ' + challenge.data.points + ' pts')
        )
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '15px',
          borderLeft: '4px solid #ec4899'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#fbbf24', fontWeight: '600', marginBottom: '8px' } }, '📖 STORYLINE'),
        React.createElement('p', { style: { color: '#d1d5db', fontStyle: 'italic' } }, challenge.data.storyline)
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '15px',
          borderLeft: '4px solid #3b82f6'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#3b82f6', fontWeight: '600', marginBottom: '8px' } }, '🎯 MISSION'),
        React.createElement('p', { style: { color: '#e5e7eb', lineHeight: '1.6', fontWeight: '600' } }, challenge.data.mission)
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '8px' } }, '📝 DESCRIPTION'),
        React.createElement('p', { style: { color: '#e5e7eb', lineHeight: '1.6' } }, challenge.data.description)
      ),

      React.createElement('div', {
        style: {
          background: 'rgba(0, 0, 0, 0.5)',
          borderRadius: '12px',
          padding: '16px',
          marginBottom: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#a855f7', fontWeight: '600', marginBottom: '8px' } }, '📂 FILES/RESOURCES'),
        React.createElement('p', { style: { color: '#d1d5db', fontFamily: 'monospace', fontSize: '14px' } }, challenge.data.files)
      ),

      challenge.data.tools && React.createElement('div', {
        style: {
          background: 'rgba(234, 179, 8, 0.1)',
          border: '1px solid rgba(234, 179, 8, 0.3)',
          borderRadius: '12px',
          padding: '12px',
          marginBottom: '15px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#fbbf24', fontWeight: '600', marginBottom: '4px' } }, '🛠️ ' + challenge.data.tools)
      )
    ),

    React.createElement('div', {
      style: {
        background: 'rgba(31, 41, 55, 0.6)',
        borderRadius: '24px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(59, 130, 246, 0.3)'
      }
    },
      React.createElement('h3', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#3b82f6' } }, '📋 Step-by-Step Solution Guide'),
      React.createElement('div', { style: { background: 'rgba(0, 0, 0, 0.4)', borderRadius: '12px', padding: '20px' } },
        challenge.data.steps.map(function(step, index) {
          return React.createElement('div', {
            key: index,
            style: {
              padding: '12px',
              marginBottom: '8px',
              background: 'rgba(59, 130, 246, 0.1)',
              borderRadius: '8px',
              borderLeft: '3px solid #3b82f6'
            }
          },
            React.createElement('p', { style: { color: '#e5e7eb', fontSize: '14px', lineHeight: '1.6', fontFamily: 'monospace' } }, step)
          );
        })
      ),
      challenge.data.realWorldContext && React.createElement('div', {
        style: {
          marginTop: '20px',
          padding: '16px',
          background: 'rgba(16, 185, 129, 0.1)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          borderRadius: '12px'
        }
      },
        React.createElement('div', { style: { fontSize: '12px', color: '#10b981', fontWeight: '600', marginBottom: '8px' } }, '🌍 REAL-WORLD CONTEXT'),
        React.createElement('p', { style: { color: '#d1d5db', fontSize: '14px', lineHeight: '1.6' } }, challenge.data.realWorldContext)
      )
    ),

    React.createElement('div', {
      style: {
        background: 'rgba(31, 41, 55, 0.6)',
        borderRadius: '24px',
        padding: '30px',
        marginBottom: '30px',
        border: '1px solid rgba(168, 85, 247, 0.2)'
      }
    },
      React.createElement('h3', { style: { fontSize: '20px', fontWeight: 'bold', marginBottom: '16px', color: '#c084fc' } }, '💡 Hints'),
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px' } },
        [0, 1, 2].map(function(index) {
          const isRevealed = revealedHints.includes(index);
          return React.createElement('div', { key: index },
            React.createElement('button', {
              onClick: function() { toggleHint(index); },
              style: {
                width: '100%',
                padding: '16px',
                background: isRevealed ? 'rgba(59, 130, 246, 0.2)' : 'rgba(55, 65, 81, 0.5)',
                border: isRevealed ? '2px solid rgba(59, 130, 246, 0.5)' : '2px solid rgba(75, 85, 99, 0.5)',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'all 0.3s',
                textAlign: 'left'
              }
            },
              isRevealed ? '🔓 Hide Hint ' + (index + 1) : '🔒 Reveal Hint ' + (index + 1)
            ),
            isRevealed && React.createElement('div', {
              style: {
                marginTop: '12px',
                padding: '16px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px'
              }
            },
              React.createElement('p', { style: { color: '#93c5fd', fontSize: '14px', lineHeight: '1.6' } }, challenge.data.hints[index])
            )
          );
        })
      )
    ),

    React.createElement('div', {
      style: {
        background: 'rgba(31, 41, 55, 0.8)',
        backdropFilter: 'blur(12px)',
        borderRadius: '24px',
        padding: '40px',
        border: '2px solid rgba(168, 85, 247, 0.3)',
        textAlign: 'center'
      }
    },
      React.createElement('h3', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' } },
        '🚩 Capture The Flag'
      ),

      flagStatus === null ? React.createElement('div', { style: { maxWidth: '500px', margin: '0 auto' } },
        React.createElement('p', { style: { color: '#d1d5db', marginBottom: '20px', fontSize: '16px' } },
          'Attempts: ' + attempts
        ),
        React.createElement('input', {
          type: 'text',
          value: flagInput,
          onChange: function(e) { setFlagInput(e.target.value); },
          onKeyPress: function(e) { if (e.key === 'Enter') submitFlag(); },
          placeholder: 'Enter flag (e.g., CTF{...})',
          style: {
            width: '100%',
            padding: '16px 24px',
            background: 'rgba(0, 0, 0, 0.7)',
            border: '2px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '12px',
            fontSize: '16px',
            color: 'white',
            marginBottom: '16px',
            outline: 'none'
          }
        }),
        React.createElement('button', {
          onClick: submitFlag,
          disabled: !flagInput.trim(),
          style: {
            width: '100%',
            padding: '16px',
            background: flagInput.trim() ? 'linear-gradient(to right, #9333ea, #ec4899)' : '#4b5563',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: flagInput.trim() ? 'pointer' : 'not-allowed',
            transition: 'all 0.3s'
          }
        }, '🚩 Submit Flag')
      ) : flagStatus === 'correct' ? React.createElement('div', null,
        React.createElement('div', { style: { fontSize: '80px', marginBottom: '20px' } }, '✅'),
        React.createElement('h4', { style: { fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' } },
          'Flag Captured!'
        ),
        React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db', marginBottom: '16px' } },
          "Congratulations! You've solved the challenge!"
        ),
        React.createElement('div', {
          style: {
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(16, 185, 129, 0.2)',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '12px',
            marginBottom: '16px'
          }
        },
          React.createElement('code', { style: { color: '#6ee7b7', fontFamily: 'monospace', fontSize: '16px' } }, challenge.data.flag)
        ),
        React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '24px' } },
          '+' + challenge.data.points + ' Points'
        ),
        React.createElement('button', {
          onClick: resetChallenge,
          style: {
            padding: '12px 24px',
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }
        }, 'Try New Challenge')
      ) : React.createElement('div', null,
        React.createElement('div', { style: { fontSize: '80px', marginBottom: '20px' } }, '❌'),
        React.createElement('h4', { style: { fontSize: '32px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' } },
          'Incorrect Flag'
        ),
        React.createElement('p', { style: { fontSize: '20px', color: '#d1d5db', marginBottom: '16px' } },
          "That's not quite right. Try reviewing the steps and hints!"
        ),
        React.createElement('div', {
          style: {
            display: 'inline-block',
            padding: '12px 24px',
            background: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid rgba(239, 68, 68, 0.5)',
            borderRadius: '12px',
            marginBottom: '24px'
          }
        },
          React.createElement('code', { style: { color: '#fca5a5', fontFamily: 'monospace' } }, flagInput)
        ),
        React.createElement('br'),
        React.createElement('button', {
          onClick: function() {
            setFlagStatus(null);
            setFlagInput('');
          },
          style: {
            padding: '12px 32px',
            background: 'linear-gradient(to right, #9333ea, #ec4899)',
            border: 'none',
            borderRadius: '12px',
            color: 'white',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }
        }, 'Try Again')
      )
    )
  )
)
