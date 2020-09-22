onmessage = async ({data: {term, tasks}}) => {
    let list = [];
    let search_term = term.toLowerCase();
    tasks.forEach(e => {
        if (e.title.toLowerCase().indexOf(search_term) !== -1 ||
            e.notes.toLowerCase().indexOf(search_term) !== -1) {
            list.push(e)
        }
    });
    postMessage(list)
};
