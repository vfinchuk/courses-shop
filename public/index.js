document.addEventListener('DOMContentLoaded', function () {
  M.Sidenav.init(document.querySelectorAll('.sidenav'))
  M.Tabs.init(document.querySelectorAll('.tabs'))
})

function toCurrency(price) {
  return new Intl.NumberFormat('ru-UA', {
    currency: 'usd',
    style: 'currency'
  }).format(price)
}

function toDate(date) {
  return new Intl.DateTimeFormat('ru-UA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).format(new Date(date))
}

document.querySelectorAll('.price').forEach($el => {
  $el.textContent = toCurrency($el.textContent)
})

document.querySelectorAll('.date').forEach($el => {
  $el.textContent = toDate($el.textContent)
})

const $card = document.querySelector('#cart')
if ($card) {
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id
      const csrf = event.target.dataset.csrf

      fetch('/cart/remove/' + id, {
        method: 'delete',
        headers: {
          'X-XSRF-TOKEN': csrf
        }
      }).then(res => res.json())
        .then(cart => {
          if (cart.courses.length) {
            const html = cart.courses.map(c => {
              return `
                <tr>
                  <td class="center">${c.title}</td>
                  <td class="center">${c.count}</td>
                  <td class="center">
                    <button class="btn btn-primary js-remove" data-id="${c.id}">Delete</button>
                  </td>
                </tr>
              `
            }).join('')
            $card.querySelector('tbody').innerHTML = html
            $card.querySelector('.price').innerHTML = toCurrency(cart.price)
          } else {
            $card.innerHTML = '<p>Cart is empty</p>'
          }
        })

    }
  })
}
