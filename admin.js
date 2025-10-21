document.addEventListener('DOMContentLoaded', function() {
    const taskEditor = document.getElementById('task-editor');
    const saveButton = document.getElementById('save-button');
    let scheduleData = null;

    // Fetch schedule data and build the editor
    fetch('/api/schedule')
        .then(response => response.json())
        .then(data => {
            scheduleData = data;
            buildEditor(scheduleData);
        })
        .catch(error => {
            console.error('Error fetching schedule data:', error);
            taskEditor.innerHTML = '<p>Error loading data. Is the server running?</p>';
        });

    function buildEditor(data) {
        let html = '<table>';
        html += '<thead><tr><th>Task Name</th><th>Duration</th><th>Done</th></tr></thead>';
        html += '<tbody>';

        for (const taskKey of data.taskOrder) {
            const duration = data.taskDurations[taskKey] || 0;
            const done = data.taskDone[taskKey] || 0;
            html += `
                <tr>
                    <td>${taskKey}</td>
                    <td><input type="number" data-task="${taskKey}" data-type="duration" value="${duration}"></td>
                    <td><input type="number" data-task="${taskKey}" data-type="done" value="${done}"></td>
                </tr>
            `;
        }

        html += '</tbody></table>';
        taskEditor.innerHTML = html;
    }

    // Save button event listener
    saveButton.addEventListener('click', function() {
        const inputs = taskEditor.querySelectorAll('input');
        inputs.forEach(input => {
            const taskKey = input.dataset.task;
            const type = input.dataset.type;
            const value = parseInt(input.value, 10);

            if (type === 'duration') {
                scheduleData.taskDurations[taskKey] = value;
            } else if (type === 'done') {
                scheduleData.taskDone[taskKey] = value;
            }
        });

        fetch('/api/schedule', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(scheduleData, null, 2),
        })
        .then(response => response.text())
        .then(result => {
            alert(result);
        })
        .catch(error => {
            console.error('Error saving schedule data:', error);
            alert('Error saving data.');
        });
    });
});
