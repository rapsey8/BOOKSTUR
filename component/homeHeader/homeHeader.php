<header class="hero-carousel">
    <div class="carousel-container">
        <div class="carousel-track">
            <!-- Slide 1: Welcome -->
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../../src/banners/banner1.jpg')">
                <div class="slide-content">
                    <h1>Welcome <span>Sebastinians!</span></h1>
                    <p class="hide-on-mobile">Your journey to excellence starts here at the official SSC-R Bookstore.</p>
                </div>
            </div>

            <!-- Slide 2: Academics -->
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../../src/banners/banner2.jpg')">
                <div class="slide-content">
                    <h1>Academic <span>Excellence</span></h1>
                    <p class="hide-on-mobile">Complete your course requirements with our wide selection of textbooks.</p>
                </div>
            </div>

            <!-- Slide 3: Uniforms -->
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../../src/banners/banner3.jpg')">
                <div class="slide-content">
                    <h1>Official <span>Attire</span></h1>
                    <p class="hide-on-mobile">Wear your school pride with the official Type A and Type B uniforms.</p>
                </div>
            </div>

            <!-- Slide 4: Supplies -->
            <div class="slide" style="background-image: linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('../../src/banners/banner4.jpg')">
                <div class="slide-content showcase-content">
                    <h1>Essential <span>Supplies</span></h1>
                    <p class="hide-on-mobile">From stationery to school gear, find all your daily classroom needs.</p>
                    <a href="../library/library.php" class="shop-now-btn">EXPLORE SHOP</a>
                </div>
            </div>
        </div>

        <!-- Navigation Arrows -->
        <button class="carousel-btn prev" onclick="moveSlide(-1)">&#10094;</button>
        <button class="carousel-btn next" onclick="moveSlide(1)">&#10095;</button>

        <!-- Navigation Dots -->
        <div class="carousel-dots">
            <span class="dot active" onclick="currentSlide(0)"></span>
            <span class="dot" onclick="currentSlide(1)"></span>
            <span class="dot" onclick="currentSlide(2)"></span>
            <span class="dot" onclick="currentSlide(3)"></span>
        </div>
    </div>
</header>

<script src="../../component/homeHeader/homeHeader.js"></script>