<?php
/**
 * Show a modal with the latest release news when the user logs in.
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly
}

function dt_release_modal() {
    if ( !is_user_logged_in() ){
        return;
    }
    $url = dt_get_url_path();
    //bail if not an a D.T front end page.
    if ( !is_archive() && !is_single() && !isset( apply_filters( "desktop_navbar_menu_options", [] )[str_replace( '/', '', $url )] ) ){
        return;
    }
    $show_notification_for_theme_version = '1.30.0'; // increment this number with each new release modal

    $theme_version = wp_get_theme()->version;
    $last_release_notification = get_user_meta( get_current_user_id(), 'dt_release_notification', true );

    if ( empty( $last_release_notification ) ) {
        $last_release_notification = '1.0.0';
    }

    if ( version_compare( $last_release_notification, $show_notification_for_theme_version, '>=' ) ){
        return;
    }
    require_once( get_template_directory().'/dt-core/libraries/parsedown/Parsedown.php' );

    update_user_meta( get_current_user_id(), 'dt_release_notification', $show_notification_for_theme_version );
    ?>
    <script>
      jQuery(document).ready(function() {
        let content = jQuery('.off-canvas-content')

        content.append(`
            <div id='release-modal' class='reveal medium' data-reveal>
                <div class="release-banner">
                    <div class="release-banner-text">
                        <h3>Release Announcement!</h3>
                        <h4>Disciple.Tools Theme Version <?php echo esc_html( $show_notification_for_theme_version ); ?></h4>
                    </div>
                </div>
                <div id="release-modal-content">
                    <div class="dt-tab-wrapper">
                        <a href="#" id="release-modal-theme-news-tab" data-content="theme-news-content" class="dt-tab dt-tab-active">Theme News</a>
                        <a href="#" id="release-modal-plugin-new-tab" data-content="plugin-news-content" class="dt-tab">Plugins News</a>
                        <a href="#" id="release-modal-translations-tab" data-content="translations-content" class="dt-tab">Translations</a>
                        <a href="#" id="release-modal-get-involved-tab" data-content="get-involved-content" class="dt-tab">Get Involved</a>
                    </div>
                    <div class="dt-tab-content" id="theme-news-content">
                        <p>
                            <?php echo wp_kses_post( dt_load_github_release_markdown( $show_notification_for_theme_version ) ); ?>
                        </p>
                    </div>
                    <div class="dt-tab-content dt-hide-content" id="plugin-news-content">
                        <h3 class="dt-tab-content-heading">Plugin news</h3>
                        <p>
                            <?php $plugin_news_links = dt_get_plugins_news_links(); ?>
                            <?php if ( !$plugin_news_links ) : ?>
                                <i><?php esc_html_e( 'Plugin news not available.', 'disciple_tools' ); ?></i>
                            <?php else : ?>
                                <?php foreach ( $plugin_news_links as $plugin_news_link ) : ?>
                                    <li><a href="<?php echo esc_attr( $plugin_news_link['url'] ); ?>" target="_blank"><?php echo esc_html( $plugin_news_link['title'] ); ?></a></li>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </p>
                    </div>
                    <div class="dt-tab-content dt-hide-content" id="translations-content">
                        <h3 class="dt-tab-content-heading">Translations</h3>
                        <p>See a problem with your language or don't see your language?
                        <br>
                        <a href="https://poeditor.com/join/project/KcPvw3oaKD">You can contribute here!</a></p>
                    </div>
                    <div class="dt-tab-content dt-hide-content" id="get-involved-content">
                        <h3 class="dt-tab-content-heading">Get Involved</h3>
                        <p>Want to help with coding or documentation? <a href="https://disciple.tools/join-the-community/">Click here</a></p>
                        <p>No coding skills but want to help out financially?
                        <br>
                        <a href="https://disciple.tools/give/">Donate to disciple.tools through gospelambition.org</a></p>
                    </div>
                </div>
                <br>
                <p class="center"><button type="button" class="button hollow" data-close>Close</button>
                <button class="close-button white-button" data-close aria-label="Close Accessible Modal" type="button">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
        `);

        jQuery('.dt-tab').on('click', function() {
            var currentVisibleTabName = $('.dt-tab-active').data('content');
            $('#' + currentVisibleTabName ).addClass('dt-hide-content');
            $('.dt-tab-active').removeClass('dt-tab-active');
            
            var desiredVisibleTabName = $(this).data('content');
            $(this).addClass('dt-tab-active');
            $( '#' + desiredVisibleTabName ).removeClass('dt-hide-content');
        });

        let div = jQuery('#release-modal');
        new Foundation.Reveal( div );
        div.foundation('open');
      })
    </script>
    <?php
}
add_action( 'wp_head', 'dt_release_modal' );

function dt_get_plugins_news_links() {
    $plugin_news_url = 'https://disciple.tools/news-categories/dt-plugin-releases/feed/';
    if ( !function_exists( 'fetch_feed' ) ) {
        return;
    }
    $feed = fetch_feed( $plugin_news_url );
    if ( is_wp_error( $feed ) ) {
        return;
    }
    $feed->set_output_encoding( 'UTF-8' );
    $feed->handle_content_type();
    $feed->set_cache_duration( 86400 );
    $limit = $feed->get_item_quantity( 10 );
    $feed_items = $feed->get_items( 0, $limit );
    $plugin_news_items = [];
    foreach ( $feed_items as $feed_item ) {
        $plugin_news_items[] = [
            'url' => $feed_item->get_permalink(),
            'title' => $feed_item->get_title(),
        ];
    }
    return $plugin_news_items;

}
function dt_load_github_release_markdown( $tag, $repo = "DiscipleTools/disciple-tools-theme" ){

    if ( empty( $repo ) || empty( $tag ) ){
        return false;
    }
    $release = get_transient( 'dt_release_notification_' . $tag );
    if ( !empty( $release ) ){
        return $release;
    }

    $url = "https://api.github.com/repos/" . esc_attr( $repo ) . "/releases/tags/" . esc_attr( $tag );
    $response = wp_remote_get( $url );

    $data_result = wp_remote_retrieve_body( $response );

    if ( !$data_result ) {
        return false;
    }
    $release = json_decode( $data_result, true );

    // end check on readme existence
    if ( !empty( $release["body"] ) ){
        $parsedown = new Parsedown();
        $release = $parsedown->text( $release["body"] );
        set_transient( 'dt_release_notification_' . $tag, $release, DAY_IN_SECONDS );
        return $release;
    }
}
