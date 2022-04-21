export async function broadcastMessage(sock, group) {
    let message = `*_Get ready for the DSE!_* ✍🏻
    
*Items to bring*
- HKID
- HKDSE Admission Form
- Completed & signed Candidate's Declaration Form, w/ negative rapid antigen test result
- Surgical masks (bring a few reserves)
- At least two ball pens
- At least two correction tapes
- HB Pencils and erasers 
- Highlighters (preferably at least 3 different colors for ENG III)
- Ruler
- Calculator (check to see if the "HKEAA APPROVED" label has worn off)
- Enough money in case you need to take a taxi
- Water
- Revision notes in case you need them
- Smartphone (turn it off before entering the venue!)
- Tissue
- Hand sanitizer
- Radio (CHIN III and ENG III)
- Earphones (not headphones) with a 3.5mm jack (CHIN III and ENG III)
- Spare batteries (CHIN III and ENG III)

*Tips*
- Stay calm and stay safe!
- Don't revise at the last minute unless you really forget something!
- Use \`\`\`a!cat\`\`\` for the power of the cat!
- Use \`\`\`a!eightball\`\`\` to test your luck! (If you're feeling lucky)

_Best of luck to all taking the DSE! Add oil!!!!!_`;

    const buttons = [
        {index: 1, urlButton: {displayText: "HKDSE 2022 Timetable", url: "https://www.hkeaa.edu.hk/DocLibrary/HKDSE/Exam_Timetable/2022_DSE_Timetable.pdf"}},
        {index: 2, urlButton: {displayText: "HKDSE 2022 Student Handbook", url: "https://www.hkeaa.edu.hk/en/hkdse/admin/student_s_handbook"}},
    ]

    const templateMessage = {
        text: message,
        footer: "Anson-Bot broadcast",
        templateButtons: buttons
    }

    console.log("Broadcasting message to group: " + group);
    await sock.sendMessage(group, templateMessage);
}