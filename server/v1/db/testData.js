import SQL from 'sql-template-strings';
import { pool, query } from '../helpers/mysql';

const years = [2017, 2018, 2019, 2020];
years.forEach(async (y) => {
    await query(SQL`
        INSERT INTO caselists (slug, name, year, event, level, team_size) VALUES
            ('ndtceda${y}', 'NDT/CEDA ${y}', ${y}, 'cx', 'college', 2),
            ('hspolicy${y}', 'HS Policy ${y}', ${y}, 'cx', 'hs', 2),
            ('hsld${y}', 'HS LD ${y}', ${y}, 'ld', 'hs', 1),
            ('hspf${y}', 'HS PF ${y}', ${y}, 'pf', 'hs', 2),
            ('nfald${y}', 'NFA LD ${y}', ${y}, 'ld', 'college', 1);
    `);
});

const schools = [
    'AmherstHarvard',
    'Army',
    'Baylor',
    'Binghamton',
    'Boston College',
    'Cal Berkeley',
    'Central Oklahoma',
    'Cornell',
    'CSU Fullerton',
    'CSU Northridge',
    'Dartmouth',
    'Emory University',
    'Emporia State',
    'George Mason',
    'Georgetown',
    'Georgia',
    'Georgia State',
    'Gonzaga',
    'Harvard',
    'Houston',
    'Indiana',
    'Iowa',
    'James Madison',
    'JCCC',
    'Kansas',
    'Kansas State',
    'Kentucky',
    'Liberty University',
    'Macalester',
    'Mary Washington',
    'Miami',
    'Michigan',
    'Michigan State University',
    'Minnesota',
    'Missouri State',
    'Navy',
    'New School',
    'NYU',
    'Oakton',
    'Oklahoma',
    'Pittsburgh',
    'Rochester',
    'Rutgers',
    'Samford',
    'Southern California',
    'Texas',
    'Texas Tech',
    'Trinity',
    'Tufts University',
    'UTD',
    'Wake Forest University',
    'Washington',
    'Washington University',
    'Wayne State',
    'West Georgia',
    'Western Washington University',
    'Wichita State',
    'Wyoming',
];
schools.forEach(async (s) => {
    await query(SQL`
        INSERT INTO schools (caselist_id, name, display_name, state, chapter_id) VALUES
            (1, ${s.replace(' ', '')}, ${s}, NULL, 1)
    `);
});

setTimeout(() => {
    pool.end();
}, 1000);
