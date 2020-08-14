document.addEventListener('DOMContentLoaded', function() {
  const elems = document.querySelectorAll('.sidenav');
  const instances = M.Sidenav.init(elems);
});

function toCurrency(price) {
  return new Intl.NumberFormat('ru-UA', {
    currency: 'usd',
    style: 'currency'
  }).format(price)
}

document.querySelectorAll('.price').forEach($el => {
  $el.textContent = toCurrency($el.textContent)
})

const $card = document.querySelector('#cart')
if ($card) {
  $card.addEventListener('click', event => {
    if (event.target.classList.contains('js-remove')) {
      const id = event.target.dataset.id

      fetch('/cart/remove/' + id, {
        method: 'delete'
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
