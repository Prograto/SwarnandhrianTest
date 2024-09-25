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

fetch(Course_Competitor__url)
    .then(response => response.json())
    .then(data => {
        console.log(data);  
        updateLogical(data);  
    })
    .catch(error => console.error('Error fetching the sheet:', error));

// Update Logical Concepts Function
function updateLogical(tests) {
    const params = new URLSearchParams(window.location.search);
    const regNo = params.get('student_id');
    const sid =document.getElementById('sid')
    sid.textContent = regNo
    console.log(regNo)

    const container = document.getElementById('card-container');

    tests.forEach(sheet => {
        // Create card element
        const card = document.createElement('div');
        card.classList.add('card');

        // Card header (Sheet Name)
        const header = document.createElement('div');
        header.classList.add('card-header');
        header.innerText = sheet.sheetName;

        // Card content (Questions and Marks)
        const content = document.createElement('div');
        content.classList.add('card-content');
        content.innerHTML = `${sheet.questionCount} Questions<br>Marks: ${sheet.totalMarks}`;

        const button = document.createElement('button');
        button.classList.add('card-button');

        if(sheet.state==="ON"){
            button.innerText = "Take Test";
            // Add click event to button to navigate to test.html
            button.addEventListener('click', () => {
                const params = new URLSearchParams({
                    student_id: regNo, // regNo from earlier code
                    sheet_name: sheet.sheetName // sheet name from the current sheet
                });
                window.location.href = `test.html?${params.toString()}`;
            });

        }
        else{
            button.innerText = "Take Disabled";
        }

        // Add everything to the card
        card.appendChild(header);
        card.appendChild(content);
        card.appendChild(button);

        // Add card to the container
        container.appendChild(card);
    });
}
