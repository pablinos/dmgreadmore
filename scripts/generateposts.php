<?php
/**
 * wp eval-file generate-test-posts.php [number_of_posts]
 *
 * Example:
 * wp eval-file generate-test-posts.php 1000
*/
// Get command line arguments
$args = $GLOBALS['argv'];
var_export($args);
$number_of_posts = isset($args[3]) ? intval($args[3]) : 100;

// Function to generate a random paragraph
function generate_random_paragraph($min_sentences = 5, $max_sentences = 12) {
    $sentences = [
        "The quick brown fox jumps over the lazy dog.",
        "A journey of a thousand miles begins with a single step.",
        "All that glitters is not gold.",
        "Don't count your chickens before they hatch.",
        "Every cloud has a silver lining.",
        "Fortune favors the bold.",
        "Hope for the best, prepare for the worst.",
        "It's better to be safe than sorry.",
        "Knowledge is power.",
        "Laughter is the best medicine.",
        "Money doesn't grow on trees.",
        "No pain, no gain.",
        "Out of sight, out of mind.",
        "Practice makes perfect.",
        "Rome wasn't built in a day.",
        "Strike while the iron is hot.",
        "The early bird catches the worm.",
        "Time flies when you're having fun.",
        "You can't judge a book by its cover.",
        "Where there's a will, there's a way.",
        "Actions speak louder than words.",
        "Beauty is in the eye of the beholder.",
        "Curiosity killed the cat.",
        "Don't put all your eggs in one basket.",
        "Easy come, easy go.",
        "Fools rush in where angels fear to tread.",
        "Good things come to those who wait.",
        "Honesty is the best policy.",
        "If at first you don't succeed, try, try again.",
        "Jack of all trades, master of none.",
        "Keep your friends close and your enemies closer.",
        "Look before you leap.",
        "Necessity is the mother of invention.",
        "Once bitten, twice shy.",
        "People who live in glass houses shouldn't throw stones.",
        "Quality over quantity.",
        "The pen is mightier than the sword.",
        "United we stand, divided we fall.",
        "Variety is the spice of life.",
        "When in Rome, do as the Romans do."
    ];

    $num_sentences = mt_rand($min_sentences, $max_sentences);
    $paragraph = '';

    for ($i = 0; $i < $num_sentences; $i++) {
        $paragraph .= $sentences[array_rand($sentences)] . ' ';
    }

    return trim($paragraph);
}

// Function to generate random post content
function generate_post_content($paragraphs = 5) {
    $content = '';

    for ($i = 0; $i < $paragraphs; $i++) {
        $paragraph_text = generate_random_paragraph();
        $content .= "<!-- wp:paragraph -->\n<p>" . $paragraph_text . "</p>\n<!-- /wp:paragraph -->\n\n";
    }

    return $content;
}

// Function to generate more unique titles
function generate_unique_title() {
    $adjectives = ['Amazing', 'Brilliant', 'Creative', 'Delightful', 'Elegant', 'Fantastic', 'Gorgeous',
                  'Harmonious', 'Incredible', 'Jubilant', 'Knowledgeable', 'Luminous', 'Magnificent',
                  'Notable', 'Outstanding', 'Powerful', 'Quintessential', 'Remarkable', 'Spectacular',
                  'Tremendous', 'Unbelievable', 'Vibrant', 'Wonderful', 'Xenial', 'Yielding', 'Zealous'];

    $nouns = ['Adventure', 'Breakthrough', 'Creation', 'Discovery', 'Experience', 'Framework', 'Gateway',
             'Harmony', 'Innovation', 'Journey', 'Knowledge', 'Legacy', 'Masterpiece', 'Narrative',
             'Opportunity', 'Perspective', 'Quality', 'Revolution', 'Strategy', 'Technique', 'Understanding',
             'Vision', 'Wonder', 'Xenolith', 'Yearning', 'Zenith'];

    $topics = ['Technology', 'Science', 'Art', 'Business', 'Health', 'Education', 'Environment',
              'Politics', 'Culture', 'Sports', 'Food', 'Travel', 'Fashion', 'Music', 'Literature',
              'History', 'Philosophy', 'Psychology', 'Economics', 'Mathematics'];

    $formats = [
        "%adj1% %noun%: The %adj2% Guide to %topic%",
        "How to Master %topic% with %adj1% %noun%",
        "%adj1% Ways to Improve Your %topic% %noun%",
        "The %adj2% %topic% %noun% You Need to Know",
        "Why %adj1% %topic% Matters for Your %noun%",
        "%topic% %noun%: A %adj2% Approach",
        "Exploring the %adj1% World of %topic% %noun%"
    ];

    $adj1 = $adjectives[array_rand($adjectives)];
    $adj2 = $adjectives[array_rand($adjectives)];
    $noun = $nouns[array_rand($nouns)];
    $topic = $topics[array_rand($topics)];
    $format = $formats[array_rand($formats)];

    $title = str_replace(
        ['%adj1%', '%adj2%', '%noun%', '%topic%'],
        [$adj1, $adj2, $noun, $topic],
        $format
    );

    return $title;
}

// Create posts
WP_CLI::log("Starting to generate $number_of_posts posts...");

$progress = \WP_CLI\Utils\make_progress_bar('Generating posts', $number_of_posts);

for ($index = 0; $index < $number_of_posts; $index++) {

    $post_data = [
        'post_title'    => generate_unique_title(),
        'post_content'  => generate_post_content(mt_rand(3, 10)),
        'post_status'   => 'publish',
        'post_author'   => 1,
        'post_type'     => 'post',
        'post_date'     => date('Y-m-d H:i:s', strtotime("-" . mt_rand(0, 365) . " days")),
    ];

    wp_insert_post($post_data);
    $progress->tick();
}

$progress->finish();
WP_CLI::success("Successfully generated $number_of_posts test posts.");
