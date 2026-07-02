const skills = [
    { name: 'Visual Design', level: 'Advanced' },
    { name: 'Interaction Design', level: 'Advanced' },
    { name: 'Frontend Development', level: 'Intermediate' },
    { name: 'Audio Experience', level: 'Growing' },
    { name: 'Storytelling', level: 'Advanced' }
];

const skillList = document.getElementById('skillList');

skills.forEach((skill) => {
    const row = document.createElement('div');
    row.className = 'skill-row';
    row.innerHTML = `<strong>${skill.name}</strong><span>${skill.level}</span>`;
    skillList.appendChild(row);
});
