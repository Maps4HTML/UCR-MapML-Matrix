export class UCR_Processor {
  constructor( json_url ) {
    this.json = null;

    // console.log(json_url);

    this.load_json(json_url);
  }

  load_json (json_url) {

    fetch(json_url)
      .then( response =>  response.json() )
      .then((json) => {
        this.json = json;
        this.create_capabilities_table();
      })
  }



  create_capabilities_table () {
    const container = document.getElementById(`cap_table_container`);
    const imp_container = document.getElementById(`implementation_container`);
    // console.log(this.json);

    let table_el = document.createElement(`table`);
    table_el.id = `approved-capabilities-table`;
    // table_el.classList.add(`bin_table`);
    let thead = document.createElement(`thead`);
    table_el.appendChild(thead);
    let tr = document.createElement(`tr`);
    thead.appendChild(tr);

    let th = document.createElement(`th`);
    th.textContent = `capability`;
    tr.appendChild(th);

    let dl = document.createElement(`dl`);

    const imps = this.json[`implementations`];
    for(let imp of imps) {
      // console.log(imp)
      Object.keys(imp).forEach(key=>{
        const val = imp[key];
        let th = document.createElement(`th`);
        th.textContent = val.title;
        tr.appendChild(th);

        // add entry to implementations list
        let dt = document.createElement(`dt`);
        dt.textContent = val.title;
        dl.appendChild(dt);
        let dd = document.createElement(`dd`);
        dd.textContent = val.desc;
        dl.appendChild(dd);
      });
    }

    let tbody = document.createElement(`tbody`);
    table_el.appendChild(tbody);

    const groups = this.json[`capability-groups`];
    Object.keys(groups).forEach(key=>{
      // console.log(key, groups[key]);
      const val = groups[key];

      let tr = document.createElement(`tr`);
      tr.id = key;
      let th = document.createElement(`th`);
      th.setAttribute(`colspan`, `999`);
      th.classList.add(`ucr-category`);
      if (!val.parent_id) {
        th.classList.add(`ucr-group`);
      }

      console.log(val.title);
      
      let a = document.createElement(`a`);
      a.href = `https://maps4html.org/HTML-Map-Element-UseCases-Requirements/#${key}`;
      a.textContent = val.title;
      let index_span = document.createElement(`span`);
      index_span.classList.add(`index`);
      index_span.textContent = ` (${val.index})`;
      a.appendChild(index_span);
      th.appendChild(a);
      

      tr.appendChild(th);
      tbody.appendChild(tr);
    });


    const caps = this.json[`capabilities`];
    // console.log(caps)
    Object.keys(caps).forEach(key=>{
      // console.log(key, groups[key]);
      const val = caps[key];

      let tr = document.createElement(`tr`);
      tr.id = key;
      let th = document.createElement(`th`);
      th.classList.add(`capability`);
      let a = document.createElement(`a`);
      a.href = `https://maps4html.org/HTML-Map-Element-UseCases-Requirements/#${key}`;
      a.textContent = val.title;
      let index_span = document.createElement(`span`);
      index_span.classList.add(`index`);
      index_span.textContent = ` (${val.index})`;
      a.appendChild(index_span);
      th.appendChild(a);
      tr.appendChild(th);

      const cap_imps = val[`implementations`];
      // console.log(cap_imps);
      for(let cap_imp of cap_imps) {
        // console.log(imp)
        Object.keys(cap_imp).forEach(key=>{
          const val = cap_imp[key];
          // console.log(val);
          let td = document.createElement(`td`);
          let val_str = val.support;
          if (val_str) {
            td.classList.add(val_str.replace(` `, `_`));
          }
          // console.log(val.support);
          td.textContent = val_str;
          tr.appendChild(td);
        });
      }

      const parent_row = tbody.querySelector(`#${val.parent_id}`);
      // console.log(parent_row);
      let next_row = parent_row;
      // while (next_row.nextElementSibling && !next_row.nextElementSibling.classList.contains(`ucr-group`)) {
      while (next_row.nextElementSibling 
        && next_row.nextElementSibling.firstChild.classList.contains(`capability`)) {
        next_row = next_row.nextElementSibling;
      }
      next_row.after(tr);
      // tbody.appendChild(tr);
    });

    let old_table = container.querySelector(`table`);
    if (old_table) {
      container.replaceChild(table_el, old_table);
    } else {
      container.appendChild(table_el);
    }

    imp_container.appendChild(dl);
  }

  find_table_position (parent_id, parent_class) {

  }

}
