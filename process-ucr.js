export class UCR_Processor {
  constructor( json_url ) {
    this.json = null;
    this.load_json(json_url);
  }

  load_json (json_url) {
    fetch(json_url)
      .then( response =>  response.json() )
      .then((json) => {
        this.json = json;
      })
      .then(() => {
        this.create_capabilities_table();
        this.create_use_cases_table();
      })
  }



  create_capabilities_table () {
    const container = document.getElementById(`cap_table_container`);
    const imp_container = document.getElementById(`implementation_container`);
    console.log(this.json);

    // create table element
    let table_el = document.createElement(`table`);
    table_el.id = `approved-capabilities-table`;

    let thead = document.createElement(`thead`);
    table_el.appendChild(thead);
    let tr = document.createElement(`tr`);
    thead.appendChild(tr);

    let th = document.createElement(`th`);
    th.textContent = `capability`;
    tr.appendChild(th);

    let dl = document.createElement(`dl`);

    // iterate over implementations for header row
    const imps = this.json[`implementations`];
    for(let imp of imps) {
      // console.log(imp)
      Object.keys(imp).forEach(key=>{
        const val = imp[key];
        let th = document.createElement(`th`);
        th.textContent = val.title;
        tr.appendChild(th);

        // add entry to implementations definition list
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

    // iterate over grouping rows, which are stored separately from capabilities
    const groups = this.json[`capability-groups`];
    Object.keys(groups).forEach(key=>{
      const val = groups[key];

      let tr = document.createElement(`tr`);
      tr.id = key;
      let th = document.createElement(`th`);
      th.setAttribute(`colspan`, `999`);
      th.classList.add(`ucr-category`);
      if (!val.parent_id) {
        th.classList.add(`ucr-group`);
      }
      
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


    // iterate over capability rows
    const caps = this.json[`capabilities`];
    Object.keys(caps).forEach(key=>{
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

      // iterate over implementation support columns for each capability rows
      const cap_imps = val[`implementations`];
      for(let cap_imp of cap_imps) {
        Object.keys(cap_imp).forEach(key=>{
          const val = cap_imp[key];
          const td = document.createElement(`td`);
          const support_status = val.support;
          if (support_status) {
            td.classList.add(support_status.replace(` `, `_`));
          }
          td.textContent = support_status;

          // // add note if available
          // const notes = val.notes;
          // if (notes) {
          //   const note_el = document.createElement(`span`);
          //   note_el.classList.add(`note`);
          //   note_el.textContent = notes;
          //   td.appendChild(note_el);
          //   td.classList.add(`annotated`);
          // }


          tr.appendChild(td);
        });
      }

      // position each capability in the proper section, relative to its grouping row
      const parent_row = tbody.querySelector(`#${val.parent_id}`);
      let next_row = parent_row;
      while (next_row.nextElementSibling 
        && next_row.nextElementSibling.firstChild.classList.contains(`capability`)) {
        next_row = next_row.nextElementSibling;
      }
      next_row.after(tr);
    });

    container.appendChild(table_el);
    imp_container.appendChild(dl);
  }


  create_use_cases_table () {
    const container = document.getElementById(`use_case_container`);
    const capabilities = this.json[`capabilities`];

    let table_el = document.createElement(`table`);
    table_el.id = `use-cases-table`;
    let thead = document.createElement(`thead`);
    table_el.appendChild(thead);
    let tr = document.createElement(`tr`);
    thead.appendChild(tr);

    // create table headers
    const use_case_headers = [
      `use case`,
      `capabilities`
    ];

    for(let use_case_header of use_case_headers) {
      let th = document.createElement(`th`);
      th.textContent = use_case_header;
      tr.appendChild(th);
    }

    let tbody = document.createElement(`tbody`);
    table_el.appendChild(tbody);

    // iterate over use-case rows (includes use-case group rows)
    const use_cases = this.json[`use-cases`];
    Object.keys(use_cases).forEach(key=>{
      const val = use_cases[key];

      let tr = document.createElement(`tr`);
      tr.id = key;
      let th = document.createElement(`th`);
      
      let a = document.createElement(`a`);
      a.href = `https://maps4html.org/HTML-Map-Element-UseCases-Requirements/#${key}`;
      a.textContent = val.title;
      let index_span = document.createElement(`span`);
      index_span.classList.add(`index`);
      index_span.textContent = ` (${val.index})`;
      a.appendChild(index_span);
      th.appendChild(a);
      tr.appendChild(th);

      if (!val.parent_id) {
        // if this is a use-case group row, mark the class and colspan
        th.classList.add(`ucr-category`);
        th.setAttribute(`colspan`, `999`);
      } else {
        // iterate over related capabilities for each use case
        let td = document.createElement(`td`);
        let ul = document.createElement(`ul`);
        td.appendChild(ul);
        const caps = val[`capabilities`];
        Object.keys(caps).forEach(key=>{
          const capability = capabilities[key];
          let li = document.createElement(`li`);
          let a = document.createElement(`a`);
          a.href = `#${key}`;

          a.textContent = capability.title;

          let index_span = document.createElement(`span`);
          index_span.classList.add(`index`);
          index_span.textContent = ` (${capability.index})`;
          a.appendChild(index_span);
          td.appendChild(a);
    
          li.appendChild(a);
          ul.appendChild(li);
        });
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    });

    container.appendChild(table_el);
  }
}
