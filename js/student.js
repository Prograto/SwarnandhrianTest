document.addEventListener('DOMContentLoaded', () => {
    // Fetch images from the server
    const url = 'https://script.google.com/macros/s/AKfycbyn9TiZpaQJEIKH39e1BUi06FJyuA-d0r1d6cnrRx_kHxSxSkk6QY3iy9HgLmfS7t5F/exec'; 

    fetch(url)
        .then(response => response.json())
        .then(data => {
            updateImages(data);
            initSlider(); // Initialize the slider only after images are loaded
        })
        .catch(error => console.error('Error fetching the sheet:', error));

    function updateImages(images) {
        const container = document.querySelector('.slider');
        container.innerHTML = ''; 
        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.classList.add('slide');
            if (index === 0) {
                slide.classList.add('active'); // Add 'active' to the first slide
            }

            const imgElement = document.createElement('img');
            imgElement.src = image.Img_Url;
            console.log(image.Img_Url);

            slide.appendChild(imgElement);
            container.appendChild(slide);
        });
    }

    function initSlider() {
        let currentIndex = 0;
        const slides = document.querySelectorAll('.slide');
        const totalSlides = slides.length;

        const showSlide = (index) => {
            // Ensure index is within bounds
            if (index >= totalSlides) {
                index = 0;
            } else if (index < 0) {
                index = totalSlides - 1;
            }

            // Update currentIndex
            currentIndex = index;

            // Hide all slides and then show the selected slide
            slides.forEach((slide, i) => {
                slide.classList.remove('active');
                if (i === currentIndex) {
                    slide.classList.add('active');
                }
            });
        };

        const nextSlide = () => {
            showSlide(currentIndex + 1);
        };

        const prevSlide = () => {
            showSlide(currentIndex - 1);
        };

        // Auto-slide every 3 seconds
        setInterval(nextSlide, 3000);

        // Add event listeners for manual navigation
        document.querySelector('.next').addEventListener('click', nextSlide);
        document.querySelector('.prev').addEventListener('click', prevSlide);

        // Show the first slide initially
        showSlide(currentIndex);
    }

    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });
});

//Feteching data or creating upcoming Events
const Course_Competitor__url = 'https://script.google.com/macros/s/AKfycbwKwbbZPPMhoTL_6Q7jKWwodLmNo5cnsRZ5tRduJqoTE4FkXUokJxml7NXfwYPyk8yxiw/exec'; 
let found = false
fetch(Course_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        updateLogical(data);  
    })
    .catch(error => console.error('Error fetching the sheet:', error));

let CompletedSheets = []
// Update Logical Concepts Function
async function updateLogical(tests) {
    const params = new URLSearchParams(window.location.search);
    const regNo = params.get('student_id');
    const sid = document.getElementById('sid');
    sid.textContent = regNo;

    const container = document.getElementById('card-container');

    // Store promises for each test
    const promises = tests.map(async (sheet) => {
        const card = document.createElement('div');
        card.classList.add('card');

        const header = document.createElement('div');
        header.classList.add('card-header');
        header.innerText = sheet.sheetName;

        const content = document.createElement('div');
        content.classList.add('card-content');
        question_c = document.createElement('p')
        marks_o = document.createElement('p')
        marks_o.classList.add(`p-${sheet.sheetName}`)
        question_c.innerHTML = `${sheet.questionCount} Questions`;
        marks_o.innerHTML = `Marks: ${sheet.totalMarks}`

        content.appendChild(question_c)
        content.appendChild(marks_o)

        const button = document.createElement('button');
        button.classList.add('btn', 'sp-font');

        if (sheet.state === "ON") {
            CompletedSheets.push(sheet.sheetName);
            button.innerText = "Take Test";
            button.classList.add(`btn-${sheet.sheetName}`);

            button.addEventListener('click', () => {
                const params = new URLSearchParams({
                    student_id: regNo,
                    sheet_name: sheet.sheetName
                });
                window.location.href = `test.html?${params.toString()}`;
            });
        } else {
            button.innerText = "Take Disabled";
        }

        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(button);
        container.appendChild(card);

        // Send test data and update button state
        if (CompletedSheets.includes(sheet.sheetName)) {
            const found = await sendTestData(regNo, sheet.sheetName);
            console.log("main:",found)
            console.log("main:",found[0].success)
            console.log("main:",found[0].marks)
            console.log("main:",found.length)
            if (found.length !== 0 && found[0].success) {
                const button = container.querySelector(`.btn-${sheet.sheetName}`);
                const p = container.querySelector(`.p-${sheet.sheetName}`);
                
                if (button) {
                    button.innerText = "Test Over";
                    button.disabled = true;
                }
                if(p){
                    p.innerHTML = `Marks Obtained : ${found[0].marks}`
                }
            }
        }
    });

    // Wait for all promises to resolve
    await Promise.all(promises);
}



function sendTestData(regNo, testName) {
    console.log('test', testName);
    const Url = 'https://script.google.com/macros/s/AKfycbxNy5HHWfK_QkGM5xKlPI51UOMNvu6YxtgyNA8O3eYUMJgWjtPHAmxR6jXlkgc1xWyk2g/exec';
    const payload = {
        regNo: regNo,
        testName: testName,
    };
    return new Promise((resolve, reject) => {
        $.post(Url, JSON.stringify(payload), function(response) {
            resolve(response); // Resolve the promise with the response
        })
        .fail(function (xhr, status, error) {
            console.error('Error:', error);
            reject(false); // Reject the promise on error
        });
    });
}
