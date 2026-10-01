package main

import (
	"fmt"

	"ecommerce-backend/config"
	"ecommerce-backend/models"
)

type seedProduct struct {
	Name        string
	Description string
	Price       float64
	Stock       int
	ImageURL    string
}

func seedDatabase() {
	// IMPORTANT:
	// Set this to true when you want to completely rebuild
	// the product catalog.
	//
	// After the catalog is successfully rebuilt,
	// change this to false.
	const resetCatalog = false

	if resetCatalog {
		if err := config.DB.Exec(
			`TRUNCATE TABLE cart_items, order_items, orders, products, categories RESTART IDENTITY CASCADE`,
		).Error; err != nil {
			fmt.Println("Catalog reset error:", err)
			return
		}

		fmt.Println("Old demo catalog cleared.")
	}

	// ============================================================
	// PRODUCT DATA
	// ============================================================
	//
	// IMPORTANT:
	// ImageURL is now taken DIRECTLY from this list.
	//
	// We do NOT fetch images from DummyJSON.
	// We do NOT replace these URLs later.
	//
	// All local images must exist inside:
	//
	// frontend/public/products/
	//
	// Example:
	// /products/hp-desktop-computers.jpg
	//
	data := map[string][]seedProduct{

		// =========================
		// ELECTRONICS
		// =========================
		"Electronics": {
			{"HP Desktop Computers", "Powerful desktop computer for home and office use", 45999, 15, "/products/hp-desktop-computers.jpg"},
			{"Mechanical Keyboards", "RGB mechanical keyboard with blue switches", 2999, 20, "/products/mechanical-keyboards.jpg"},
			{"Wireless Mice", "High precision wireless mouse", 1999, 25, "/products/wireless-mice.jpg"},
			{"JBL Bluetooth Speakers", "Portable wireless speaker with powerful sound", 3499, 20, "/products/jbl-bluetooth-speakers.jpg"},
			{"USB Accessories Hub", "4 port USB hub for computers and laptops", 999, 35, "/products/usb-accessories-hub.jpg"},
		},

		// =========================
		// MOBILES
		// =========================
		"Mobiles": {
			{"Samsung Galaxy S24", "Flagship Samsung Android smartphone", 69999, 12, "/products/samsung-galaxy-s24.jpg"},
			{"OnePlus 12", "Premium OnePlus performance smartphone", 59999, 10, "/products/oneplus-12.jpg"},
			{"Apple iPhone 15", "Apple smartphone with advanced camera", 69999, 8, "/products/apple-iphone-15.jpg"},
			{"Xiaomi Redmi Note 13", "Affordable Xiaomi Android smartphone", 17999, 25, "/products/xiaomi-redmi-note-13.jpg"},
			{"Mobile Accessories Kit", "Phone case, cable and screen protector kit", 799, 40, "/products/mobile-accessories-kit.jpg"},
		},

		// =========================
		// LAPTOPS
		// =========================
		"Laptops": {
			{"HP Pavilion 15", "Intel Core i5 HP laptop", 64999, 10, "/products/hp-pavilion-15.jpg"},
			{"Dell Inspiron 15", "Everyday productivity Dell laptop", 57999, 12, "/products/dell-inspiron-15.jpg"},
			{"Lenovo IdeaPad Slim 5", "Slim Lenovo performance laptop", 62999, 14, "/products/lenovo-ideapad-slim-5.jpg"},
			{"ASUS Vivobook 15", "Lightweight ASUS student laptop", 54999, 16, "/products/asus-vivobook-15.jpg"},
			{"Laptop Accessories Kit", "Laptop sleeve, mouse and cleaning kit", 1499, 30, "/products/laptop-accessories-kit.jpg"},
		},

		// =========================
		// GAMING
		// =========================
		"Gaming": {
			{"PlayStation 5 Gaming Consoles", "Next generation gaming console", 49999, 8, "/products/playstation-5-gaming-consoles.jpg"},
			{"Sony DualSense Controllers", "Wireless gaming controller", 5999, 20, "/products/sony-dualsense-controllers.jpg"},
			{"Razer Gaming Headsets", "Immersive gaming headset with microphone", 6999, 15, "/products/razer-gaming-headsets.jpg"},
			{"Razer Gaming Keyboards", "Mechanical RGB gaming keyboard", 7999, 15, "/products/razer-gaming-keyboards.jpg"},
			{"Logitech Gaming Mice", "High precision gaming mouse", 4999, 18, "/products/logitech-gaming-mice.jpg"},
		},

		// =========================
		// HEADPHONES
		// =========================
		"Headphones": {
			{"Sony Wireless Headphones", "Premium wireless over-ear headphones", 12999, 12, "/products/sony-wireless-headphones.jpg"},
			{"JBL Bluetooth Headphones", "Bluetooth headphones with deep bass", 4999, 25, "/products/jbl-bluetooth-headphones.jpg"},
			{"Noise Cancelling Headphones", "Over-ear headphones with active noise cancellation", 9999, 15, "/products/noise-cancelling-headphones.jpg"},
			{"OnePlus Earbuds", "Compact true wireless earbuds", 5499, 22, "/products/oneplus-earbuds.jpg"},
		},
		// =========================
		// SMART WATCHES
		// =========================
		"Smart Watches": {
			{"Apple Watch Series 9", "Advanced Apple smartwatch", 42999, 8, "/products/apple-watch-series-9.jpg"},
			{"Samsung Galaxy Watch 6", "Premium Samsung Android smartwatch", 24999, 12, "/products/samsung-galaxy-watch-6.jpg"},
			{"Noise Smart Watch", "Affordable Noise smartwatch", 3499, 30, "/products/noise-smart-watch.jpg"},
			{"Fitness Watches Pro", "Smart fitness watch with activity tracking", 2999, 25, "/products/fitness-watches-pro.jpg"},
		},

		// =========================
		// CAMERAS
		// =========================
		"Cameras": {
			{"Canon DSLR Camera", "Entry level DSLR camera", 39999, 6, "/products/canon-dslr-camera.jpg"},
			{"Sony Mirrorless Camera", "Compact mirrorless digital camera", 74999, 5, "/products/sony-mirrorless-camera.jpg"},
			{"Sony Digital Cameras", "Compact digital camera for everyday photography", 29999, 8, "/products/sony-digital-cameras.jpg"},
			{"Camera Accessories Kit", "Tripod, camera bag and cleaning kit", 2499, 20, "/products/camera-accessories-kit.jpg"},
		},
		// =========================
		// TV & ENTERTAINMENT
		// =========================
		"TV & Entertainment": {
			{"Samsung Smart TVs", "Smart television with streaming apps", 44999, 8, "/products/samsung-smart-tvs.jpg"},
			{"Sony 4K TVs", "4K UHD Google TV", 69999, 6, "/products/sony-4k-tvs.jpg"},
			{"LG LED TVs", "Full HD LED television", 32999, 10, "/products/lg-led-tvs.jpg"},
			{"JBL Entertainment Speakers", "Powerful home entertainment speaker", 12999, 15, "/products/jbl-entertainment-speakers.jpg"},
		},

		// =========================
		// COMPUTER ACCESSORIES
		// =========================
		"Computer Accessories": {
			{"Logitech Mouse", "Silent wireless computer mouse", 1499, 40, "/products/logitech-mouse.jpg"},
			{"HP Keyboard", "Slim wireless computer keyboard", 1799, 30, "/products/hp-keyboard.jpg"},
			{"Logitech Webcams", "Full HD webcam for meetings and streaming", 6999, 15, "/products/logitech-webcams.jpg"},
			{"USB Accessories Hub", "USB-C hub with HDMI and USB ports", 2499, 25, "/products/usb-accessories-hub-computer.jpg"},
		},
		// =========================
		// GAMING ACCESSORIES
		// =========================
		"Gaming Accessories": {
			{"Ant Esports Gaming Chairs", "Ergonomic gaming chair", 12999, 10, "/products/ant-esports-gaming-chairs.jpg"},
			{"RGB Mouse Pads", "Large RGB gaming mouse pad", 1999, 25, "/products/rgb-mouse-pads.jpg"},
			{"Xbox Controllers", "Wireless gaming controller", 5999, 15, "/products/xbox-controllers.jpg"},
			{"Gaming Accessories Kit", "Gaming stand, cable set and controller holder", 2499, 20, "/products/gaming-accessories-kit.jpg"},
		},

		// =========================
		// FASHION
		// =========================
		"Fashion": {
			{"Cotton Shirts", "Regular fit casual cotton shirt", 999, 50, "/products/cotton-shirts.jpg"},
			{"Cotton T-Shirts", "Premium cotton everyday T-shirt", 599, 70, "/products/cotton-t-shirts.jpg"},
			{"Slim Fit Jeans", "Comfortable denim jeans", 1499, 45, "/products/slim-fit-jeans.jpg"},
			{"Denim Jackets", "Classic denim jacket", 1999, 25, "/products/denim-jackets.jpg"},
		},

		// =========================
		// SHOES
		// =========================
		"Shoes": {
			{"Nike Running Shoes", "Lightweight cushioned running shoes", 4999, 20, "/products/nike-running-shoes.jpg"},
			{"Classic Sneakers", "Classic everyday sneakers", 3999, 25, "/products/classic-sneakers.jpg"},
			{"Casual Shoes", "Comfortable casual footwear", 2999, 30, "/products/casual-shoes.jpg"},
			{"Sports Shoes", "Shoes for gym and training", 2499, 35, "/products/sports-shoes.jpg"},
		},

		// =========================
		// BEAUTY & CARE
		// =========================
		"Beauty & Care": {
			{"Face Care Cleanser", "Gentle daily face care cleanser", 299, 60, "/products/face-care-cleanser.jpg"},
			{"Body Care Lotion", "Moisturizing body care lotion", 399, 50, "/products/body-care-lotion.jpg"},
			{"Hair Care Shampoo", "Daily hair care shampoo", 499, 55, "/products/hair-care-shampoo.jpg"},
			{"Skin Care Kit", "Daily skin care essentials", 999, 30, "/products/skin-care-kit.jpg"},
		},

		// =========================
		// HOME & KITCHEN
		// =========================
		"Home & Kitchen": {
			{"Non Stick Cookware Set", "Three piece non-stick cookware set", 2499, 20, "/products/non-stick-cookware-set.jpg"},
			{"Electric Kitchen Appliances Kettle", "1.5 litre electric kettle", 1299, 35, "/products/electric-kitchen-appliances-kettle.jpg"},
			{"Kitchen Storage Set", "Airtight storage containers", 799, 50, "/products/kitchen-storage-set.jpg"},
			{"Home Essentials Pack", "Useful household essentials for everyday use", 1499, 30, "/products/home-essentials-pack.jpg"},
		},

		// =========================
		// FURNITURE
		// =========================
		"Furniture": {
			{"Office Chairs", "Ergonomic office chair", 6999, 15, "/products/office-chairs.jpg"},
			{"Study Tables", "Compact wooden study table", 4999, 12, "/products/study-tables.jpg"},
			{"Three Seater Sofas", "Comfortable living room sofa", 19999, 5, "/products/three-seater-sofas.jpg"},
			{"Office Furniture Desk", "Modern work desk", 5999, 10, "/products/office-furniture-desk.jpg"},
		},

		// =========================
		// SPORTS
		// =========================
		"Sports": {
			{"Cricket Bat", "English willow cricket bat", 4999, 15, "/products/cricket-bat.jpg"},
			{"Football", "Professional size football", 999, 30, "/products/football.jpg"},
			{"Fitness Dumbbells", "Adjustable home workout dumbbells", 2499, 20, "/products/fitness-dumbbells.jpg"},
			{"Outdoor Sports Badminton Racket", "Lightweight badminton racket", 1499, 25, "/products/outdoor-sports-badminton-racket.jpg"},
		},

		// =========================
		// GROCERIES
		// =========================
		"Groceries": {
			{"Aashirvaad Atta", "Whole wheat flour 5kg", 299, 60, "/products/aashirvaad-atta.jpg"},
			{"India Gate Rice", "Premium basmati rice 5kg", 699, 50, "/products/india-gate-rice.jpg"},
			{"Toor Dal & Pulses", "Premium split pigeon peas 1kg", 179, 55, "/products/toor-dal-pulses.jpg"},
			{"Fortune Cooking Oil", "Refined sunflower cooking oil 1L", 149, 70, "/products/fortune-cooking-oil.jpg"},
			{"Tata Salt & Sugar Pack", "Everyday salt and sugar essentials", 99, 70, "/products/tata-salt-sugar-pack.jpg"},
			{"Multi Grain Flours", "Healthy multi grain flour pack", 349, 45, "/products/multi-grain-flours.jpg"},
			{"Organic Products Pack", "Selected organic grocery essentials", 499, 30, "/products/organic-products-pack.jpg"},
		},

		// =========================
		// BOOKS
		// =========================
		"Books": {
			{"Programming Book - Clean Code", "Programming and software craftsmanship", 799, 20, "/products/programming-book-clean-code.jpg"},
			{"Fiction Novel Collection", "Popular fiction novel", 499, 30, "/products/fiction-novel-collection.jpg"},
			{"Education Study Guide", "Comprehensive education and study guide", 699, 25, "/products/education-study-guide.jpg"},
			{"Self Help Book", "Practical guide to personal growth", 499, 35, "/products/self-help-book.jpg"},
		},

		// =========================
		// TOYS & GAMES
		// =========================
		"Toys & Games": {
			{"LEGO Building Toys", "Creative construction building set", 1499, 25, "/products/lego-building-toys.jpg"},
			{"Remote Control Car", "Rechargeable RC toy car", 1999, 20, "/products/remote-control-car.jpg"},
			{"Chess Board Games", "Classic wooden board game set", 799, 30, "/products/chess-board-games.jpg"},
			{"Kids Games Learning Kit", "Educational games for kids", 999, 35, "/products/kids-games-learning-kit.jpg"},
		},

		// =========================
		// AUTOMOTIVE
		// =========================
		"Automotive": {
			{"Car Accessories Phone Holder", "Dashboard mobile phone holder", 499, 50, "/products/car-accessories-phone-holder.jpg"},
			{"Bike Accessories Mobile Holder", "Handlebar phone mount", 699, 40, "/products/bike-accessories-mobile-holder.jpg"},
			{"Car Cleaning Kit", "Complete vehicle cleaning accessories", 999, 35, "/products/car-cleaning-kit.jpg"},
			{"Interior Accessories Car Organizer", "Multi-pocket car interior organizer", 799, 30, "/products/interior-accessories-car-organizer.jpg"},
		},
	}

	// ============================================================
	// CREATE CATEGORIES AND PRODUCTS
	// ============================================================

	for categoryName, products := range data {

		var category models.Category

		result := config.DB.
			Where("name = ?", categoryName).
			First(&category)

		if result.Error != nil {

			category = models.Category{
				Name: categoryName,
			}

			if err := config.DB.Create(&category).Error; err != nil {
				fmt.Println("Category error:", categoryName, err)
				continue
			}
		}

		// ========================================================
		// CREATE / UPDATE PRODUCTS
		// ========================================================

		for _, productData := range products {

			var product models.Product

			result := config.DB.Where(
				"name = ? AND category_id = ?",
				productData.Name,
				category.ID,
			).First(&product)

			// ====================================================
			// UPDATE EXISTING PRODUCT
			// ====================================================

			if result.Error == nil {

				product.Description = productData.Description
				product.Price = productData.Price
				product.Stock = productData.Stock

				// IMPORTANT:
				// Use EXACTLY the image path from seedProduct.
				// Never replace it with DummyJSON.
				product.ImageURL = productData.ImageURL

				if err := config.DB.Save(&product).Error; err != nil {
					fmt.Println(
						"Product update error:",
						productData.Name,
						err,
					)
				}

				continue
			}

			// ====================================================
			// CREATE NEW PRODUCT
			// ====================================================

			product = models.Product{
				Name:        productData.Name,
				Description: productData.Description,
				Price:       productData.Price,
				Stock:       productData.Stock,
				ImageURL:    productData.ImageURL,
				CategoryID:  category.ID,
			}

			if err := config.DB.Create(&product).Error; err != nil {
				fmt.Println(
					"Product create error:",
					productData.Name,
					err,
				)
			}
		}
	}

	fmt.Println("Product catalog seeded successfully!")
}
