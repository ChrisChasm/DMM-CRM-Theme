<?php
require_once( get_template_directory() . '/tests/dt-posts/tests-setup.php' );

/**
 * @testdox DT_Posts::update_post
 */
class DT_Posts_DT_Posts_Update_Post extends WP_UnitTestCase {

    public static $sample_contact = [
        'title' => 'Bob',
        'overall_status' => 'active',
        'milestones' => [ "values" => [ [ "value" => 'milestone_has_bible' ], [ "value" => "milestone_baptizing" ] ] ],
        'baptism_date' => "2018-12-31",
        "location_grid" => [ "values" => [ [ "value" => '100089589' ] ] ],
        "assigned_to" => "1",
        "requires_update" => true,
        "nickname" => "Bob the builder",
        "contact_phone" => [ "values" => [ [ "value" => "798456780" ] ] ],
        "contact_email" => [ "values" => [ [ "value" => "bob@example.com" ] ] ],
        "tags" => [ "values" => [ [ "value" => "tag1" ], [ "value" => "tagToDelete" ] ] ],
    ];
    public static $contact = null;

    public static function setupBeforeClass() {
        //setup custom fields for each field type and custom tile.
//        wp_cache_flush();

        $user_id = wp_create_user( "dispatcher1", "test", "test2@example.com" );
        wp_set_current_user( $user_id );
        $current_user = wp_get_current_user();
        $current_user->set_role( 'dispatcher' );

        self::$contact = DT_Posts::create_post( "contacts", self::$sample_contact, true, false );
    }

    public function test_update_on_custom_fields(){
        $user_id = wp_create_user( "dispatcher3", "test", "test3@example.com" );
        wp_set_current_user( $user_id );
        $update_values = dt_test_get_sample_record_fields();
        $result = DT_Posts::update_post( "contacts", self::$contact["ID"], $update_values, true, false );
        $this->assertNotWPError( $result );


        //setting values on each field type
        //@todo connection field
        $this->assertSame( $result["title"], $update_values['title'] );
        $this->assertSame( (int) $result["number_test"], (int) $update_values['number_test'] ); //@todo returned value should be an int
        $this->assertSame( $result["text_test"], $update_values['text_test'] );
        $this->assertSame( $result["text_test_private"], $update_values['text_test_private'] );
        $this->assertSame( $result["contact_communication_channel_test"][0]["value"], $update_values['contact_communication_channel_test']["values"][0]["value"] );
        $this->assertSame( $result["user_select_test"], "user-" . $update_values['user_select_test'] );
        $this->assertSame( $result["array_test"], $update_values['array_test'] );
        $this->assertSame( (int) $result["location_test"][0]["id"], (int) $update_values['location_test']["values"][0]["value"] ); //@todo returned value should be an int
        $this->assertSame( (int) $result["date_test"]["timestamp"], strtotime( $update_values['date_test'] ) ); //@todo returned value should be an int
        $this->assertSame( (int) $result["date_test_private"]["timestamp"], strtotime( $update_values['date_test_private'] ) ); //@todo returned value should be an int
        $this->assertSame( $result["boolean_test"], $update_values['boolean_test'] );
        $this->assertTrue( $result["boolean_test_private"] );
        $this->assertSame( $result["multi_select_test"][0], $update_values['multi_select_test']["values"][0]["value"] );
        $this->assertSame( $result["multi_select_test"][1], $update_values['multi_select_test']["values"][1]["value"] );
        $this->assertSame( $result["multi_select_test_private"][0], $update_values['multi_select_test_private']["values"][0]["value"] );
        $this->assertSame( $result["multi_select_test_private"][1], $update_values['multi_select_test_private']["values"][1]["value"] );
        $this->assertSame( $result["key_select_test"]["key"], $update_values['key_select_test'] );
        $this->assertSame( $result["key_select_test_private"]["key"], $update_values['key_select_test_private'] );
        $this->assertSame( $result["tags_test"][0], $update_values['tags_test']["values"][0]["value"] );
        $this->assertSame( $result["tags_test_private"][0], $update_values['tags_test_private']["values"][0]["value"] );
    }

    /**
     * @testdox Tags: add
     */
    public function test_tags_add() {
        //force values with update
        $initial_count = sizeof( self::$contact['tags'] );
        $result = DT_Posts::update_post( 'contacts', self::$contact["ID"], [
            'tags' => [
                "values" => [
                    [ "value" => "tag2", ],
                    [ "value" => "tag3", ],
                ],
            ], //@phpcs:ignore
        ], true, false );

        $this->assertNotWPError( $result );
        $this->assertContains( "tag2", $result['tags'] );
        $this->assertContains( "tag3", $result['tags'] );
        $this->assertSame( sizeof( $result["tags"] ), $initial_count + 2 );
    }
    /**
     * @testdox Tags: remove
     */
    public function test_tags_remove() {
        //force values with update
        $initial_count = sizeof( self::$contact['tags'] );
        $result = DT_Posts::update_post( 'contacts', self::$contact["ID"], [
            'tags' => [
                "values" => [
                    [ "value" => "tagToDelete", "delete" => true, ],
                ],
            ], //@phpcs:ignore
        ], true, false );

        $this->assertNotWPError( $result );
        $this->assertNotContains( "tagToDelete", $result['tags'] );
        $this->assertSame( sizeof( $result["tags"] ), $initial_count - 1 );
    }
    /**
     * @testdox Tags: force update
     */
    public function test_tags_force() {
        //force values with update
        $result = DT_Posts::update_post( 'contacts', self::$contact["ID"], [
            'tags' => [
                "values" => [
                    [ "value" => "tag98", ],
                    [ "value" => "tag99", ],
                ],
                "force_values" => true,
            ], //@phpcs:ignore
        ], true, false );
        $this->assertNotWPError( $result );

        $this->assertContains( "tag98", $result['tags'] );
        $this->assertContains( "tag99", $result['tags'] );
        $this->assertSame( sizeof( $result["tags"] ), 2 );
    }
}
