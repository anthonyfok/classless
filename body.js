const h = require('react-hyperscript')
const Helmet = require('react-helmet').default
const React = require('react')
const Draggable = require('react-draggable')

module.exports = class extends React.Component {
  constructor (props) {
    super(props)

    let theme = (
      (this.props.location.search ||
        typeof location === 'undefined' ? '' : location.search
      ).split('?')[1] || ''
    )
      .split('&')
      .map(kv => kv.split('='))
      .filter(([k, v]) => k === 'theme')
      .map(([_, v]) => v)[0] ||
        (typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem('theme')) ||
        this.props.global.themes[0]

    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('theme', theme)
    }

    this.state = {
      theme
    }
  }

  render () {
    let navitems = this.props.scenarioList
      ? this.props.scenarioList.map(name =>
        h('li', {key: name}, [
          h('a', {href: '/scenarios/' + name}, name)
        ])
      )
      : [
        h('li', [ h('a', {href: '/'}, 'Introduction') ]),
        h('li', [ h('a', {href: '/for-personal-websites'}, 'For personal websites') ]),
        h('li', [ h('a', {href: '/for-cms-makers'}, 'For CMS markers') ]),
        h('li', [ h('a', {href: '/for-theme-writers'}, 'For theme writers') ]),
        h('li', [ h('a', {href: '/scenarios'}, 'Testing scenarios') ]),
        h('li', [ h('a', {href: 'https://github.com/fiatjaf/classless/tree/master/themes'}, 'Browse the themes') ])
      ]

    let main = this.props.scenarioList
      ? h(React.Fragment, {key: 'main'}, this.props.children)
      : h('main', {key: 'main'}, this.props.children)

    return [
      h(Helmet, {
        key: 'helmet',
        link: [{
          rel: 'stylesheet',
          href: this.state.theme.startsWith('http')
            ? this.state.theme
            : 'https://rawgit.com/fiatjaf/classless/gh-pages/themes/' + this.state.theme + '/theme.css'
        }]
      }),
      h('header', {key: 'header', role: 'banner'}, [
        h('h1', [
          h('a', {href: '/'}, 'classless')
        ]),
        h('aside', [
          h('p', 'Pure-CSS themes for standard HTML formats.')
        ])
      ]),
      h('nav', {key: 'nav'}, [
        h('ul', navitems)
      ]),
      main,
      h('aside', {key: 'aside'}, [
        h('p', 'Egestas dui id ornare arcu odio ut sem nulla. Purus sit amet volutpat consequat mauris nunc congue nisi vitae. Gravida cum sociis natoque penatibus et magnis dis parturient. Ac turpis egestas sed tempus urna et pharetra pharetra massa.'),
        h('p', 'Tincidunt dui ut ornare lectus sit amet est placerat. Tempus egestas sed sed risus pretium quam. Bibendum arcu vitae elementum curabitur vitae nunc. Quis risus sed vulputate odio ut enim blandit volutpat.')
      ]),
      h('footer', {
        key: 'footer',
        role: 'contentinfo'
      }, [
        h('p', [
          h('a', {href: 'https://fiatjaf.alhur.es/'}, 'fiatjaf'),
          ' 2018'
        ])
      ]),
      h(Draggable, {
        key: 'theme-chooser',
        onStart: e => {
          if (e.target.tagName === 'INPUT') {
            return false
          }
        }
      }, [
        h('#theme-chooser', [
          h('label', [
            'Paste your theme CSS URL here:',
            h('input', {
              value: this.state.theme,
              onChange: e => {
                sessionStorage.setItem('theme', e.target.value)
                this.setState({theme: e.target.value})
              }
            })
          ])
        ])
      ]),
      h('script', {
        key: 'trackingco.de',
        dangerouslySetInnerHTML: {
          __html: `
(function (d, s, c) {
  var x, h, n = Date.now()
  tc = function (p) {
    m = s.getItem('_tcx') > n ? s.getItem('_tch') : 'tarola-tagarela'
    x = new XMLHttpRequest()
    x.addEventListener('load', function () {
      if (x.status == 200) {
        s.setItem('_tch', x.responseText)
        s.setItem('_tcx', n + 14400000)
      }
    })
    x.open('GET', 'https://visitantes.alhur.es/'+m+'.xml?r='+d.referrer+'&c='+c+(p?'&p='+p:''))
    x.send()
  }
  tc()
})(document, localStorage, 'yklzb7m1')
          `
        }
      }),
      h('script', {key: 'bundle', src: '/bundle.js'}),
      this.props.global.livereload_host && h('script', {
        key: 'livereload',
        src: 'http://' + this.props.global.livereload_host + ':35729/livereload.js?snipver=1'
      })
    ]
  }
}