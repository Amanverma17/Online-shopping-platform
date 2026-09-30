package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"

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

type dummyProduct struct {
	Title     string   `json:"title"`
	Category  string   `json:"category"`
	Thumbnail string   `json:"thumbnail"`
	Images    []string `json:"images"`
}

type dummyResponse struct {
	Products []dummyProduct `json:"products"`
}

// Gets real product images from the current DummyJSON catalog.
func getRealProductImages() map[string][]string {
	result := make(map[string][]string)

	url := "https://dummyjson.com/products?limit=0"

	response, err := http.Get(url)
	if err != nil {
		fmt.Println("Could not fetch DummyJSON products:", err)
		return result
	}
	defer response.Body.Close()

	if response.StatusCode != http.StatusOK {
		fmt.Println("DummyJSON returned status:", response.StatusCode)
		return result
	}

	var data dummyResponse

	if err := json.NewDecoder(response.Body).Decode(&data); err != nil {
		fmt.Println("Could not decode DummyJSON response:", err)
		return result
	}

	for _, product := range data.Products {
		image := product.Thumbnail

		if len(product.Images) > 0 {
			image = product.Images[0]
		}

		if image == "" {
			continue
		}

		category := strings.ToLower(product.Category)

		result[category] = append(result[category], image)
	}

	fmt.Println("Real product images loaded:", len(data.Products))

	return result
}

func seedDatabase() {
	// IMPORTANT:
	// Set this to true for the FIRST run only.
	// It removes the old demo catalog so old products/broken images do not remain.
	// It also removes old demo carts/orders because they reference old products.
	// After the first successful run, change this to false.
	const resetCatalog = true

	if resetCatalog {
		if err := config.DB.Exec(`TRUNCATE TABLE cart_items, order_items, orders, products, categories RESTART IDENTITY CASCADE`).Error; err != nil {
			fmt.Println("Catalog reset error:", err)
			return
		}
		fmt.Println("Old demo catalog cleared.")
	}

	// Each product uses a fixed direct image URL.
	// The numeric DummyJSON image URLs are stable direct image files.
	data := map[string][]seedProduct{
		// =========================
		// ELECTRONICS
		// =========================
		"Electronics": {
			{"HP Desktop Computers", "Powerful desktop computer for home and office use", 45999, 15, "/products/hp-desktop-computers.svg"},
			{"Mechanical Keyboards", "RGB mechanical keyboard with blue switches", 2999, 20, "/products/mechanical-keyboards.svg"},
			{"Wireless Mice", "High precision wireless mouse", 1999, 25, "/products/wireless-mice.svg"},
			{"JBL Bluetooth Speakers", "Portable wireless speaker with powerful sound", 3499, 20, "/products/jbl-bluetooth-speakers.svg"},
			{"USB Accessories Hub", "4 port USB hub for computers and laptops", 999, 35, "/products/usb-accessories-hub.svg"},
		},

		// =========================
		// MOBILES
		// =========================
		"Mobiles": {
			{"Samsung Galaxy S24", "Flagship Samsung Android smartphone", 69999, 12, "/products/samsung-galaxy-s24.svg"},
			{"OnePlus 12", "Premium OnePlus performance smartphone", 59999, 10, "/products/oneplus-12.svg"},
			{"Apple iPhone 15", "Apple smartphone with advanced camera", 69999, 8, "/products/apple-iphone-15.svg"},
			{"Xiaomi Redmi Note 13", "Affordable Xiaomi Android smartphone", 17999, 25, "/products/xiaomi-redmi-note-13.svg"},
			{"Mobile Accessories Kit", "Phone case, cable and screen protector kit", 799, 40, "/products/mobile-accessories-kit.svg"},
		},

		// =========================
		// LAPTOPS
		// =========================
		"Laptops": {
			{"HP Pavilion 15", "Intel Core i5 HP laptop", 64999, 10, "/products/hp-pavilion-15.svg"},
			{"Dell Inspiron 15", "Everyday productivity Dell laptop", 57999, 12, "/products/dell-inspiron-15.svg"},
			{"Lenovo IdeaPad Slim 5", "Slim Lenovo performance laptop", 62999, 14, "/products/lenovo-ideapad-slim-5.svg"},
			{"ASUS Vivobook 15", "Lightweight ASUS student laptop", 54999, 16, "/products/asus-vivobook-15.svg"},
			{"Laptop Accessories Kit", "Laptop sleeve, mouse and cleaning kit", 1499, 30, "/products/laptop-accessories-kit.svg"},
		},

		// =========================
		// GAMING
		// =========================
		"Gaming": {
			{"PlayStation 5 Gaming Consoles", "Next generation gaming console", 49999, 8, "/products/playstation-5-gaming-consoles.svg"},
			{"Sony DualSense Controllers", "Wireless gaming controller", 5999, 20, "/products/sony-dualsense-controllers.svg"},
			{"Razer Gaming Headsets", "Immersive gaming headset with microphone", 6999, 15, "/products/razer-gaming-headsets.svg"},
			{"Razer Gaming Keyboards", "Mechanical RGB gaming keyboard", 7999, 15, "/products/razer-gaming-keyboards.svg"},
			{"Logitech Gaming Mice", "High precision gaming mouse", 4999, 18, "/products/logitech-gaming-mice.svg"},
		},

		// =========================
		// HEADPHONES
		// =========================
		"Headphones": {
			{"Sony Wireless Headphones", "Premium wireless over-ear headphones", 12999, 12, "/products/sony-wireless-headphones.svg"},
			{"JBL Bluetooth Headphones", "Bluetooth headphones with deep bass", 4999, 25, "/products/jbl-bluetooth-headphones.svg"},
			{"Noise Cancelling Headphones", "Over-ear headphones with active noise cancellation", 9999, 15, "/products/noise-cancelling-headphones.svg"},
			{"OnePlus Earbuds", "Compact true wireless earbuds", 5499, 22, "/products/oneplus-earbuds.svg"},
		},

		// =========================
		// SMART WATCHES
		// =========================
		"Smart Watches": {
			{"Apple Watch Series 9", "Advanced Apple smartwatch", 42999, 8, "/products/apple-watch-series-9.svg"},
			{"Samsung Galaxy Watch 6", "Premium Samsung Android smartwatch", 24999, 12, "/products/samsung-galaxy-watch-6.svg"},
			{"Noise Smart Watch", "Affordable Noise smartwatch", 3499, 30, "/products/noise-smart-watch.svg"},
			{"Fitness Watches Pro", "Smart fitness watch with activity tracking", 2999, 25, "/products/fitness-watches-pro.svg"},
		},

		// =========================
		// CAMERAS
		// =========================
		"Cameras": {
			{"Canon DSLR Camera", "Entry level DSLR camera", 39999, 6, "/products/canon-dslr-camera.svg"},
			{"Sony Mirrorless Camera", "Compact mirrorless digital camera", 74999, 5, "/products/sony-mirrorless-camera.svg"},
			{"Sony Digital Cameras", "Compact digital camera for everyday photography", 29999, 8, "/products/sony-digital-cameras.svg"},
			{"Camera Accessories Kit", "Tripod, camera bag and cleaning kit", 2499, 20, "/products/camera-accessories-kit.svg"},
		},

		// =========================
		// TV & ENTERTAINMENT
		// =========================
		"TV & Entertainment": {
			{"Samsung Smart TVs", "Smart television with streaming apps", 44999, 8, "/products/samsung-smart-tvs.svg"},
			{"Sony 4K TVs", "4K UHD Google TV", 69999, 6, "/products/sony-4k-tvs.svg"},
			{"LG LED TVs", "Full HD LED television", 32999, 10, "/products/lg-led-tvs.svg"},
			{"JBL Entertainment Speakers", "Powerful home entertainment speaker", 12999, 15, "/products/jbl-entertainment-speakers.svg"},
		},

		// =========================
		// COMPUTER ACCESSORIES
		// =========================
		"Computer Accessories": {
			{"Logitech Mouse", "Silent wireless computer mouse", 1499, 40, "/products/logitech-mouse.svg"},
			{"HP Keyboard", "Slim wireless computer keyboard", 1799, 30, "/products/hp-keyboard.svg"},
			{"Logitech Webcams", "Full HD webcam for meetings and streaming", 6999, 15, "/products/logitech-webcams.svg"},
			{"USB Accessories Hub", "USB-C hub with HDMI and USB ports", 2499, 25, "https://cdn.dummyjson.com/product-images/40/thumbnail.jpg"},
		},

		// =========================
		// GAMING ACCESSORIES
		// =========================
		"Gaming Accessories": {
			{"Ant Esports Gaming Chairs", "Ergonomic gaming chair", 12999, 10, "/products/ant-esports-gaming-chairs.svg"},
			{"RGB Mouse Pads", "Large RGB gaming mouse pad", 1999, 25, "/products/rgb-mouse-pads.svg"},
			{"Xbox Controllers", "Wireless gaming controller", 5999, 15, "/products/xbox-controllers.svg"},
			{"Gaming Accessories Kit", "Gaming stand, cable set and controller holder", 2499, 20, "/products/gaming-accessories-kit.svg"},
		},

		// =========================
		// FASHION
		// =========================
		"Fashion": {
			{"Cotton Shirts", "Regular fit casual cotton shirt", 999, 50, "/products/cotton-shirts.svg"},
			{"Cotton T-Shirts", "Premium cotton everyday T-shirt", 599, 70, "/products/cotton-t-shirts.svg"},
			{"Slim Fit Jeans", "Comfortable denim jeans", 1499, 45, "/products/slim-fit-jeans.svg"},
			{"Denim Jackets", "Classic denim jacket", 1999, 25, "/products/denim-jackets.svg"},
		},

		// =========================
		// SHOES
		// =========================
		"Shoes": {
			{"Nike Running Shoes", "Lightweight cushioned running shoes", 4999, 20, "/products/nike-running-shoes.svg"},
			{"Classic Sneakers", "Classic everyday sneakers", 3999, 25, "/products/classic-sneakers.svg"},
			{"Casual Shoes", "Comfortable casual footwear", 2999, 30, "/products/casual-shoes.svg"},
			{"Sports Shoes", "Shoes for gym and training", 2499, 35, "/products/sports-shoes.svg"},
		},

		// =========================
		// BEAUTY & CARE
		// =========================
		"Beauty & Care": {
			{"Face Care Cleanser", "Gentle daily face care cleanser", 299, 60, "/products/face-care-cleanser.svg"},
			{"Body Care Lotion", "Moisturizing body care lotion", 399, 50, "/products/body-care-lotion.svg"},
			{"Hair Care Shampoo", "Daily hair care shampoo", 499, 55, "/products/hair-care-shampoo.svg"},
			{"Skin Care Kit", "Daily skin care essentials", 999, 30, "/products/skin-care-kit.svg"},
		},

		// =========================
		// HOME & KITCHEN
		// =========================
		"Home & Kitchen": {
			{"Non Stick Cookware Set", "Three piece non-stick cookware set", 2499, 20, "/products/non-stick-cookware-set.svg"},
			{"Electric Kitchen Appliances Kettle", "1.5 litre electric kettle", 1299, 35, "/products/electric-kitchen-appliances-kettle.svg"},
			{"Kitchen Storage Set", "Airtight storage containers", 799, 50, "/products/kitchen-storage-set.svg"},
			{"Home Essentials Pack", "Useful household essentials for everyday use", 1499, 30, "/products/home-essentials-pack.svg"},
		},

		// =========================
		// FURNITURE
		// =========================
		"Furniture": {
			{"Office Chairs", "Ergonomic office chair", 6999, 15, "/products/office-chairs.svg"},
			{"Study Tables", "Compact wooden study table", 4999, 12, "/products/study-tables.svg"},
			{"Three Seater Sofas", "Comfortable living room sofa", 19999, 5, "/products/three-seater-sofas.svg"},
			{"Office Furniture Desk", "Modern work desk", 5999, 10, "/products/office-furniture-desk.svg"},
		},

		// =========================
		// SPORTS
		// =========================
		"Sports": {
			{"Cricket Bat", "English willow cricket bat", 4999, 15, "/products/cricket-bat.svg"},
			{"Football", "Professional size football", 999, 30, "/products/football.svg"},
			{"Fitness Dumbbells", "Adjustable home workout dumbbells", 2499, 20, "/products/fitness-dumbbells.svg"},
			{"Outdoor Sports Badminton Racket", "Lightweight badminton racket", 1499, 25, "/products/outdoor-sports-badminton-racket.svg"},
		},

		// =========================
		// GROCERIES
		// =========================
		"Groceries": {
			{"Aashirvaad Atta", "Whole wheat flour 5kg", 299, 60, "/products/aashirvaad-atta.svg"},
			{"India Gate Rice", "Premium basmati rice 5kg", 699, 50, "/products/india-gate-rice.svg"},
			{"Toor Dal & Pulses", "Premium split pigeon peas 1kg", 179, 55, "/products/toor-dal-and-pulses.svg"},
			{"Fortune Cooking Oil", "Refined sunflower cooking oil 1L", 149, 70, "/products/fortune-cooking-oil.svg"},
			{"Tata Salt & Sugar Pack", "Everyday salt and sugar essentials", 99, 70, "/products/tata-salt-and-sugar-pack.svg"},
			{"Multi Grain Flours", "Healthy multi grain flour pack", 349, 45, "/products/multi-grain-flours.svg"},
			{"Organic Products Pack", "Selected organic grocery essentials", 499, 30, "/products/organic-products-pack.svg"},
		},

		// =========================
		// BOOKS
		// =========================
		"Books": {
			{"Programming Book - Clean Code", "Programming and software craftsmanship", 799, 20, "/products/programming-book-clean-code.svg"},
			{"Fiction Novel Collection", "Popular fiction novel", 499, 30, "/products/fiction-novel-collection.svg"},
			{"Education Study Guide", "Comprehensive education and study guide", 699, 25, "/products/education-study-guide.svg"},
			{"Self Help Book", "Practical guide to personal growth", 499, 35, "/products/self-help-book.svg"},
		},

		// =========================
		// TOYS & GAMES
		// =========================
		"Toys & Games": {
			{"LEGO Building Toys", "Creative construction building set", 1499, 25, "/products/lego-building-toys.svg"},
			{"Remote Control Car", "Rechargeable RC toy car", 1999, 20, "/products/remote-control-car.svg"},
			{"Chess Board Games", "Classic wooden board game set", 799, 30, "/products/chess-board-games.svg"},
			{"Kids Games Learning Kit", "Educational games for kids", 999, 35, "/products/kids-games-learning-kit.svg"},
		},

		// =========================
		// AUTOMOTIVE
		// =========================
		"Automotive": {
			{"Car Accessories Phone Holder", "Dashboard mobile phone holder", 499, 50, "/products/car-accessories-phone-holder.svg"},
			{"Bike Accessories Mobile Holder", "Handlebar phone mount", 699, 40, "/products/bike-accessories-mobile-holder.svg"},
			{"Car Cleaning Kit", "Complete vehicle cleaning accessories", 999, 35, "/products/car-cleaning-kit.svg"},
			{"Interior Accessories Car Organizer", "Multi-pocket car interior organizer", 799, 30, "/products/interior-accessories-car-organizer.svg"},
		},
	}

	// ============================================================
	// GET REAL PRODUCT IMAGES FROM DUMMYJSON
	// ============================================================

	realImages := getRealProductImages()

	// Map ABB Store categories to DummyJSON categories.
	categoryMap := map[string][]string{
		"Electronics": {
			"laptops",
			"tablets",
			"smartphones",
			"mobile-accessories",
		},

		"Mobiles": {
			"smartphones",
			"mobile-accessories",
		},

		"Laptops": {
			"laptops",
		},

		"Gaming": {
			"gaming",
			"sports-accessories",
		},

		"Headphones": {
			"mobile-accessories",
		},

		"Smart Watches": {
			"mens-watches",
			"womens-watches",
		},

		"Cameras": {
			"mobile-accessories",
		},

		"TV & Entertainment": {
			"home-decoration",
		},

		"Computer Accessories": {
			"laptops",
			"mobile-accessories",
		},

		"Gaming Accessories": {
			"sports-accessories",
		},

		"Fashion": {
			"mens-shirts",
			"tops",
			"womens-dresses",
			"mens-shoes",
			"womens-shoes",
		},

		"Shoes": {
			"mens-shoes",
			"womens-shoes",
		},

		"Beauty & Care": {
			"beauty",
			"skin-care",
		},

		"Home & Kitchen": {
			"kitchen-accessories",
			"home-decoration",
		},

		"Furniture": {
			"furniture",
		},

		"Sports": {
			"sports-accessories",
		},

		"Groceries": {
			"groceries",
		},

		"Books": {
			"home-decoration",
		},

		"Toys & Games": {
			"sports-accessories",
		},

		"Automotive": {
			"vehicle",
			"motorcycle",
		},
	}

	// ============================================================
	// CREATE CATEGORIES AND PRODUCTS
	// ============================================================

	for categoryName, products := range data {

		var category models.Category

		result := config.DB.Where("name = ?", categoryName).First(&category)

		if result.Error != nil {
			category = models.Category{
				Name: categoryName,
			}

			if err := config.DB.Create(&category).Error; err != nil {
				fmt.Println("Category error:", categoryName, err)
				continue
			}
		}

		// Get the image categories for this ABB category.
		imageCategories := categoryMap[categoryName]

		// Keep track of which real image to use.
		imageIndex := 0

		for _, productData := range products {

			// ====================================================
			// REPLACE OLD IMAGE URL WITH REAL PRODUCT IMAGE
			// ====================================================

			for _, imageCategory := range imageCategories {

				images := realImages[imageCategory]

				if len(images) > 0 {

					// Give each product a different image.
					productData.ImageURL = images[imageIndex%len(images)]

					imageIndex++

					break
				}
			}

			// ====================================================
			// FIND EXISTING PRODUCT
			// ====================================================

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
